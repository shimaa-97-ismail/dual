// import React from 'react'
// import { Navigate,Outlet } from 'react-router-dom';

// export function ProtectedRoute() {
//    const token = localStorage.getItem("token");
//   return token ? <Outlet /> : <Navigate to="/login" />;
// }

// ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/Auth/AuthContext';

export const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading, token } = useContext(AuthContext);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">جاري التحميل...</div>;
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />; // or a custom "غير مصرح" page
  }

  return <Outlet />;
};
