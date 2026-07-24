import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const RoleGuard = ({ allowedRoles = [], children }) => {
  const token = useSelector((state) => state.auth?.token);
  const authUser = useSelector((state) => state.auth?.user);
  const profileUser = useSelector((state) => state.profile?.user);
  const profileLoading = useSelector((state) => state.profile?.loading);

  const user = profileUser || authUser;
  const currentRole = user?.accountType || user?.role;

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!currentRole && profileLoading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (allowedRoles.length > 0 && currentRole !== "Admin" && !allowedRoles.includes(currentRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RoleGuard;
