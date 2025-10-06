import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}>
        Loading...
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/app/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
