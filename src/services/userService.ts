// ============================================================================
// NOVAMARKET - USER & AUTH SERVICE
// ============================================================================

import { ProfileEntity, UserRole } from '../types';
import { apiClient, localRepo } from './apiClient';

export interface RegisterPayload {
  email: string;
  password?: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  storeName?: string;
  storeDescription?: string;
  phoneNumber?: string;
}

export const defaultSeedProfiles: ProfileEntity[] = [
  {
    id: 'usr-admin-01',
    email: 'admin@novamarket.fr',
    role: 'admin',
    firstName: 'Sarah',
    lastName: 'Benali',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80',
    bio: 'Super-Administratrice de la plateforme NovaMarket.',
    phoneNumber: '+33 1 42 68 55 00',
    onboardingCompleted: true,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-05-15T12:00:00Z',
  },
  {
    id: 'usr-vendor-01',
    email: 'sophie.martin@atelier-nova.fr',
    role: 'vendor',
    firstName: 'Sophie',
    lastName: 'Martin',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
    bio: "Artisane céramiste & fondatrice de l'Atelier Lumière.",
    phoneNumber: '+33 4 78 22 10 90',
    storeId: 'seller-atelier-lumiere',
    storeName: 'Atelier Lumière',
    onboardingCompleted: true,
    createdAt: '2024-02-10T14:30:00Z',
    updatedAt: '2024-05-18T09:00:00Z',
  },
  {
    id: 'usr-client-01',
    email: 'alexandre.dupont@gmail.com',
    role: 'client',
    firstName: 'Alexandre',
    lastName: 'Dupont',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
    bio: "Passionné de design scandinave et d'artisanat local.",
    phoneNumber: '+33 6 12 34 56 78',
    onboardingCompleted: true,
    createdAt: '2024-03-05T16:00:00Z',
    updatedAt: '2024-05-10T11:20:00Z',
  },
];

export const UserService = {
  // Get all registered profiles
  async getAllProfiles(): Promise<ProfileEntity[]> {
    try {
      return await apiClient.request<ProfileEntity[]>('/users');
    } catch {
      return localRepo.get<ProfileEntity[]>('novamarket_profiles', defaultSeedProfiles);
    }
  },

  // Get single profile by ID
  async getProfileById(id: string): Promise<ProfileEntity | undefined> {
    try {
      return await apiClient.request<ProfileEntity>(`/users/${id}`);
    } catch {
      const profiles = await this.getAllProfiles();
      return profiles.find((p) => p.id === id);
    }
  },

  // Authenticate user by email
  async login(email: string, _password?: string): Promise<{ success: boolean; user?: ProfileEntity; token?: string; error?: string }> {
    const trimmedEmail = email.trim().toLowerCase();
    try {
      const response = await apiClient.request<{ user: ProfileEntity; token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: trimmedEmail, password: _password }),
      });
      apiClient.setToken(response.token);
      return { success: true, user: response.user, token: response.token };
    } catch {
      const profiles = await this.getAllProfiles();
      const found = profiles.find((p) => p.email.toLowerCase() === trimmedEmail);
      if (!found) {
        return {
          success: false,
          error: 'Aucun compte trouvé avec cette adresse email. Vérifiez vos identifiants ou créez un compte.',
        };
      }
      const demoToken = `token-demo-${found.id}-${Date.now()}`;
      apiClient.setToken(demoToken);
      return { success: true, user: found, token: demoToken };
    }
  },

  // Register a new profile
  async register(payload: RegisterPayload): Promise<{ success: boolean; user?: ProfileEntity; token?: string; error?: string }> {
    const trimmedEmail = payload.email.trim().toLowerCase();
    try {
      const response = await apiClient.request<{ user: ProfileEntity; token: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      apiClient.setToken(response.token);
      return { success: true, user: response.user, token: response.token };
    } catch {
      const profiles = await this.getAllProfiles();
      if (profiles.some((p) => p.email.toLowerCase() === trimmedEmail)) {
        return {
          success: false,
          error: 'Cette adresse email est déjà associée à un compte NovaMarket. Veuillez vous connecter.',
        };
      }

      const newProfile: ProfileEntity = {
        id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        email: trimmedEmail,
        role: payload.role,
        firstName: payload.firstName.trim(),
        lastName: payload.lastName.trim(),
        photoUrl:
          payload.role === 'vendor'
            ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80'
            : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80',
        phoneNumber: payload.phoneNumber || null,
        bio: payload.role === 'vendor' ? (payload.storeDescription || 'Boutique indépendante') : 'Client NovaMarket',
        storeId: payload.role === 'vendor' ? `seller-${Date.now()}` : null,
        storeName: payload.role === 'vendor' ? (payload.storeName || `${payload.firstName} Atelier`) : null,
        onboardingCompleted: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updated = [...profiles, newProfile];
      localRepo.set('novamarket_profiles', updated);
      const token = `token-${newProfile.id}-${Date.now()}`;
      apiClient.setToken(token);
      return { success: true, user: newProfile, token };
    }
  },

  // Update profile details
  async updateProfile(userId: string, data: Partial<ProfileEntity>): Promise<ProfileEntity> {
    try {
      return await apiClient.request<ProfileEntity>(`/users/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    } catch {
      const profiles = await this.getAllProfiles();
      const index = profiles.findIndex((p) => p.id === userId);
      if (index === -1) {
        throw new Error('Utilisateur non trouvé');
      }
      const updated: ProfileEntity = {
        ...profiles[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      profiles[index] = updated;
      localRepo.set('novamarket_profiles', profiles);
      return updated;
    }
  },

  // Upgrade buyer to vendor
  async upgradeToVendor(userId: string, storeName: string, description?: string): Promise<ProfileEntity> {
    try {
      return await apiClient.request<ProfileEntity>(`/users/${userId}/upgrade-vendor`, {
        method: 'POST',
        body: JSON.stringify({ storeName, description }),
      });
    } catch {
      const profiles = await this.getAllProfiles();
      const user = profiles.find((p) => p.id === userId);
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }
      const updatedUser: ProfileEntity = {
        ...user,
        role: 'vendor',
        storeId: user.storeId || `seller-${Date.now()}`,
        storeName: storeName.trim(),
        bio: description || user.bio,
        updatedAt: new Date().toISOString(),
      };
      const updatedList = profiles.map((p) => (p.id === userId ? updatedUser : p));
      localRepo.set('novamarket_profiles', updatedList);
      return updatedUser;
    }
  },

  // Logout
  async logout(): Promise<void> {
    try {
      await apiClient.request('/auth/logout', { method: 'POST' });
    } catch {
      // Ignore network errors on logout
    } finally {
      apiClient.setToken(null);
    }
  },
};
