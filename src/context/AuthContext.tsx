import React, { createContext, useContext } from 'react';
import { ProfileEntity, UserRole } from '../types';
import { useAuthStore, AuthStoreState } from '../store/authStore';
import { RegisterPayload, defaultSeedProfiles } from '../services/userService';

export type { RegisterPayload };
export { defaultSeedProfiles as defaultProfiles };

interface AuthContextType {
  currentUser: ProfileEntity | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (payload: RegisterPayload) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchDemoAccount: (role: UserRole) => void;
  upgradeToVendor: (storeName: string, description?: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (data: Partial<ProfileEntity>) => Promise<boolean>;
  registeredProfiles: ProfileEntity[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const authStore = useAuthStore();

  const value: AuthContextType = {
    currentUser: authStore.currentUser,
    isAuthenticated: authStore.isAuthenticated,
    login: authStore.login,
    register: authStore.register,
    logout: authStore.logout,
    switchDemoAccount: authStore.switchDemoAccount,
    upgradeToVendor: authStore.upgradeToVendor,
    updateProfile: authStore.updateProfile,
    registeredProfiles: authStore.registeredProfiles,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // If used outside provider, gracefully fall back directly to the Zustand store
    const store = useAuthStore.getState();
    return {
      currentUser: store.currentUser,
      isAuthenticated: store.isAuthenticated,
      login: store.login,
      register: store.register,
      logout: store.logout,
      switchDemoAccount: store.switchDemoAccount,
      upgradeToVendor: store.upgradeToVendor,
      updateProfile: store.updateProfile,
      registeredProfiles: store.registeredProfiles,
    };
  }
  return context;
};
