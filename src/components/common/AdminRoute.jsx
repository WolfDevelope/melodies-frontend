import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../../services/authService';

const AdminRoute = ({ children }) => {
  const user = authService.getCurrentUser();
  const role = user?.role;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role !== 'admin') {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default AdminRoute;
