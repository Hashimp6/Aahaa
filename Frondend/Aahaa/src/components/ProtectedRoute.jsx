import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);
  const location = useLocation();

  if (!token) {
    // Redirect to login page but save the attempted URL
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

const GuestRoute = ({ children }) => {
    const token = useSelector((state) => state.auth.token);
    
    if (token) {
      return <Navigate to="/home" replace />;
    }
  
    return children;
  };
  
  export { ProtectedRoute, GuestRoute };