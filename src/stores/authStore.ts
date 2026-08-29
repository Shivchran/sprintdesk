import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image?: string;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;

  login: (
    user: AuthUser,
    accessToken: string,
    refreshToken: string
  ) => void;

  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      login: (user, accessToken, refreshToken) => {
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "sprintdesk-auth",
      partialize: (state) => ({
  user: state.user,
  accessToken: state.accessToken,
  refreshToken: state.refreshToken,
  isAuthenticated: state.isAuthenticated,
}),
    }
  )
);