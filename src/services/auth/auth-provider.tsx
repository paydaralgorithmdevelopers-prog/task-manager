"use client";

import { AuthUser } from "@/types/auth.types";
import {
    PropsWithChildren,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import { AuthActionsContext, AuthContext } from "./auth-context";

function AuthProvider({ children }: PropsWithChildren) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  const loadCurrentUser = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me", { method: "GET" });
      if (response.ok) {
        const data: AuthUser = await response.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadCurrentUser();
  }, [loadCurrentUser]);

  const logOut = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      setUser(null);
    }
  }, []);

  const contextValue = useMemo(() => ({ isLoaded, user }), [isLoaded, user]);

  const actionsValue = useMemo(
    () => ({ setUser, logOut }),
    [logOut]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      <AuthActionsContext.Provider value={actionsValue}>
        {children}
      </AuthActionsContext.Provider>
    </AuthContext.Provider>
  );
}

export default AuthProvider;
