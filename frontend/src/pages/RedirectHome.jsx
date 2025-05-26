import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';

export default function RedirectHome() {
  const { token } = useContext(AuthContext);
  return <Navigate to={token ? '/posts' : '/login'} replace />;
}
