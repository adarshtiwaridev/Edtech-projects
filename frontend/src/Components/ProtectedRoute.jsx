import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { fetchProfile } from '../slices/profileSlice';
import { setToken } from '../slices/authSlice';

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const reduxToken = useSelector((state) => state.auth.token);
  const localToken = localStorage.getItem("token");
  const token = reduxToken || localToken;
  const profileUser = useSelector((state) => state.profile.user);

  useEffect(() => {
    if (localToken && !reduxToken) {
      dispatch(setToken(localToken));
    }
    if (token && !profileUser) {
      dispatch(fetchProfile());
    }
  }, [token, reduxToken, localToken, profileUser, dispatch]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
