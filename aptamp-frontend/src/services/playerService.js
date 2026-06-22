import api from '../api/axios';

const playerService = {
  searchPlayers: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.district) params.append('district', filters.district);
    if (filters.page !== undefined) params.append('page', filters.page);
    if (filters.size !== undefined) params.append('size', filters.size);

    const response = await api.get(`/players/search?${params.toString()}`);
    return response.data;
  },

  getPlayerProfile: async (id) => {
    const response = await api.get(id ? `/players/${id}` : '/players/profile');
    return response.data;
  },

  updatePlayerProfile: async (id, data) => {
    const url = id ? `/players/${id}` : '/players/profile';
    const response = await api.put(url, data);
    return response.data;
  },

  approvePlayer: async (id) => {
    const response = await api.post(`/players/${id}/approve`);
    return response.data;
  },

  rejectPlayer: async (id) => {
    const response = await api.post(`/players/${id}/reject`);
    return response.data;
  },

  registerPlayer: async (data) => {
    const response = await api.post('/players', data);
    return response.data;
  }
};

export default playerService;
