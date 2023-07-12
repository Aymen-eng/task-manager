// hoc.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/'); // Redirect to login if user is not authenticated
    }
  }, [loading, user, navigate]);

  if (loading) {
    return <p>Loading...</p>; // Show loading text while checking auth state
  }

  if (error) {
    // Handle error
    return <p>Error: {error.message}</p>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
