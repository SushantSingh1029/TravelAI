import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;

  if (!user) return <Navigate to="/login" />;

  return children;
}
