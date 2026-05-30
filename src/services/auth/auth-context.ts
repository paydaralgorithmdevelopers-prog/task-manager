"use client";

import { AuthUser } from "@/types/auth.types";
import { createContext } from "react";

export const AuthContext = createContext<{
  user: AuthUser | null;
  isLoaded: boolean;
}>({
  user: null,
  isLoaded: false,
});

export const AuthActionsContext = createContext<{
  setUser: (user: AuthUser | null) => void;
  logOut: () => Promise<void>;
}>({
  setUser: () => {},
  logOut: async () => {},
});

