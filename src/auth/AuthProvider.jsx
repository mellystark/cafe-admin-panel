import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import * as authService from "../services/authService";

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      if (!authService.isAuthenticated()) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const hasScope = authService.hasAdminScope();
      setIsAdmin(hasScope);
      setLoading(false);
    };

    checkAuth();
  }, []);

  const logout = () => {
    authService.logout();
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAdmin,
        loading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
