import { useSelector, useDispatch } from 'react-redux';
import { setCredentials, logout as logoutAction, updateUser } from '../store/authSlice';
import authService from '../services/authService';

export default function useAuth() {
  const { user, token, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    dispatch(setCredentials({
      token: data.token,
      refreshToken: data.refreshToken,
      user: data.user,
    }));
    return data.user;
  };

  const register = async (details) => {
    const data = await authService.register(details);
    if (data.token && data.user) {
      dispatch(setCredentials({
        token: data.token,
        refreshToken: data.refreshToken,
        user: data.user,
      }));
    }
    return data;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      dispatch(logoutAction());
    }
  };

  const updateProfile = (profileData) => {
    dispatch(updateUser(profileData));
  };

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
  };
}
