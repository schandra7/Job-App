import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function RequireAuth({ allowedRoles = [] }) {
  const { token, role } = useAuth();

  if (!token) return <Navigate to="/login" replace />;
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) return <Navigate to="/" replace />;

  return <Outlet />;
}