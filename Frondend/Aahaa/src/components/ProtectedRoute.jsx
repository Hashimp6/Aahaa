// src/components/ProtectedRoute.js
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    // No token in localStorage means user is not authenticated
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

const GuestRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    // If token exists, redirect to home
    return <Navigate to="/home" replace />;
  }

  return children;
};

export { ProtectedRoute, GuestRoute };