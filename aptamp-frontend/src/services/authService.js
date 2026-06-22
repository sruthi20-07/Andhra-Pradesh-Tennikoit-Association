import api from '../api/axios';

const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  register: async (details) => {
    const response = await api.post('/auth/register', details);
    return response.data;
  },
  
  refreshToken: async (token) => {
    const response = await api.post('/auth/refresh-token', { refreshToken: token });
    return response.data;
  },
  
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.warn('Backend logout failed or not implemented', e);
    }
  }
};

export default authService;
