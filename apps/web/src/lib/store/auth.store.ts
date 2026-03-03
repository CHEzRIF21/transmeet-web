import { create } from "zustand";

export type UserRole = "EXPEDITEUR" | "TRANSPORTEUR" | "ADMIN" | "DOUANIER";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  preferredLang?: string;
}

interface AuthState {
  user: User | null;
  role: UserRole | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  isLoading: false,
  login: async (_email: string, _password: string) => {
    set({ isLoading: true });
    // TODO: appel API Supabase / backend
    set({ isLoading: false });
  },
  logout: async () => {
    set({ user: null, role: null });
  },
  updateUser: (user) => {
    set((state) =>
      state.user ? { user: { ...state.user, ...user } } : state
    );
  },
}));
