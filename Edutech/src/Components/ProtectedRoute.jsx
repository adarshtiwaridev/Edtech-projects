import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { fetchProfile } from '../slices/profileSlice';

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const profileUser = useSelector((state) => state.profile.user);

  // if we have a token but no profile loaded yet, fetch it
  useEffect(() => {
    if (token && !profileUser) {
      dispatch(fetchProfile());
    }
  }, [token, profileUser, dispatch]);

  if (!token) {
    // redirect unauthenticated users to login
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
