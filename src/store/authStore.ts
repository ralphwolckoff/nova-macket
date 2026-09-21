// ============================================================================
// NOVAMARKET - AUTH STORE (ZUSTAND)
// ============================================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProfileEntity, UserRole } from '../types';
import { UserService, RegisterPayload, defaultSeedProfiles } from '../services/userService';

export interface AuthStoreState {
  currentUser: ProfileEntity | null;
  isAuthenticated: boolean;
  token: string | null;
  registeredProfiles: ProfileEntity[];

  // Actions
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (payload: RegisterPayload) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<ProfileEntity>) => Promise<boolean>;
  upgradeToVendor: (storeName: string, description?: string) => Promise<{ success: boolean; error?: string }>;
  switchDemoAccount: (role: UserRole) => void;
  setRegisteredProfiles: (profiles: ProfileEntity[]) => void;
}

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isAuthenticated: false,
      token: null,
      registeredProfiles: defaultSeedProfiles,

      login: async (email, password) => {
        const res = await UserService.login(email, password);
        if (res.success && res.user) {
          set({
            currentUser: res.user,
            isAuthenticated: true,
            token: res.token || null,
          });
          return { success: true };
        }
        return { success: false, error: res.error || 'Identifiants invalides' };
      },

      register: async (payload) => {
        const res = await UserService.register(payload);
        if (res.success && res.user) {
          const updatedList = [...get().registeredProfiles, res.user];
          set({
            currentUser: res.user,
            isAuthenticated: true,
            token: res.token || null,
            registeredProfiles: updatedList,
          });
          return { success: true };
        }
        return { success: false, error: res.error || "Erreur lors de l'inscription" };
      },

      logout: () => {
        UserService.logout();
        set({
          currentUser: null,
          isAuthenticated: false,
          token: null,
        });
      },

      updateProfile: async (data) => {
        const current = get().currentUser;
        if (!current) return false;

        try {
          const updated = await UserService.updateProfile(current.id, data);
          const updatedProfiles = get().registeredProfiles.map((p) =>
            p.id === updated.id ? updated : p
          );
          set({
            currentUser: updated,
            registeredProfiles: updatedProfiles,
          });
          return true;
        } catch {
          return false;
        }
      },

      upgradeToVendor: async (storeName, description) => {
        const current = get().currentUser;
        if (!current) {
          return { success: false, error: 'Vous devez être connecté pour activer votre boutique.' };
        }

        try {
          const updated = await UserService.upgradeToVendor(current.id, storeName, description);
          const updatedProfiles = get().registeredProfiles.map((p) =>
            p.id === updated.id ? updated : p
          );
          set({
            currentUser: updated,
            registeredProfiles: updatedProfiles,
          });
          return { success: true };
        } catch (err: any) {
          return { success: false, error: err?.message || 'Erreur de mise à niveau' };
        }
      },

      switchDemoAccount: (role) => {
        const account =
          get().registeredProfiles.find((p) => p.role === role) ||
          defaultSeedProfiles.find((p) => p.role === role);
        if (account) {
          set({
            currentUser: account,
            isAuthenticated: true,
            token: `token-demo-${account.id}`,
          });
        }
      },

      setRegisteredProfiles: (profiles) => {
        set({ registeredProfiles: profiles });
      },
    }),
    {
      name: 'novamarket_auth_state',
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
        token: state.token,
        registeredProfiles: state.registeredProfiles,
      }),
    }
  )
);
