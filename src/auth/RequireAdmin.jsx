import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

export function RequireAdmin({ children }) {
  const { isAdmin, loading } = useContext(AuthContext);

  if (loading) return null; // veya spinner

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
