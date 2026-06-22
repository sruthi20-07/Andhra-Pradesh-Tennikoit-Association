import { createSlice } from '@reduxjs/toolkit';

const parseStoredUser = () => {
  try {
    const raw = localStorage.getItem('aptamp_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const initialState = {
  token: localStorage.getItem('aptamp_token') || null,
  user: parseStoredUser(),
  isAuthenticated: !!localStorage.getItem('aptamp_token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action) {
      const { token, refreshToken, user } = action.payload;
      state.token = token;
      state.user = user;
      state.isAuthenticated = true;
      localStorage.setItem('aptamp_token', token);
      if (refreshToken) {
        localStorage.setItem('aptamp_refresh_token', refreshToken);
      }
      localStorage.setItem('aptamp_user', JSON.stringify(user));
    },
    logout(state) {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('aptamp_token');
      localStorage.removeItem('aptamp_refresh_token');
      localStorage.removeItem('aptamp_user');
    },
    updateUser(state, action) {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('aptamp_user', JSON.stringify(state.user));
    },
  },
});

export const { setCredentials, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
