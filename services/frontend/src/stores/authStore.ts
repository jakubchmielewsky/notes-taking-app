import { create } from "zustand";
import { registerTokenAccessors } from "@/api/client";
import type { CurrentUserResponse } from "@notes/shared-types";

type AuthStatus = "loading" | "authed" | "unauthed";

type AuthState = {
  accessToken: string | null;
  user: CurrentUserResponse | null;
  status: AuthStatus;
  setToken: (token: string) => void;
  setUser: (user: CurrentUserResponse) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  status: "loading",

  setToken: (token) => set({ accessToken: token, status: "authed" }),
  setUser: (user) => set({ user }),
  logout: () => set({ accessToken: null, user: null, status: "unauthed" }),
}));

registerTokenAccessors(
  () => useAuthStore.getState().accessToken,
  (token) => useAuthStore.getState().setToken(token),
  () => useAuthStore.getState().logout(),
);
