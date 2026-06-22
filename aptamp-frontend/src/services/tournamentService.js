import api from '../api/axios';

const tournamentService = {
  getTournaments: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    const response = await api.get(`/tournaments?${params.toString()}`);
    return Array.isArray(response.data) ? response.data : (response.data?.data || response.data?.content || []);
  },

  getTournamentById: async (id) => {
    const response = await api.get(`/tournaments/${id}`);
    return response.data;
  },

  createTournament: async (data) => {
    const response = await api.post('/tournaments', data);
    return response.data;
  },

  updateTournament: async (id, data) => {
    const response = await api.put(`/tournaments/${id}`, data);
    return response.data;
  },

  deleteTournament: async (id) => {
    const response = await api.delete(`/tournaments/${id}`);
    return response.data;
  },

  registerForTournament: async (data) => {
    // data: { tournamentId, categoryId, playerDetails... }
    const response = await api.post('/registrations', data);
    return response.data;
  },

  getRegistrations: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.tournamentId) params.append('tournamentId', filters.tournamentId);
    if (filters.status) params.append('status', filters.status);
    const response = await api.get(`/registrations?${params.toString()}`);
    return response.data;
  },

  updateRegistrationStatus: async (id, status) => {
    // status: 'APPROVED' or 'REJECTED'
    const response = await api.put(`/registrations/${id}/status`, { status });
    return response.data;
  }
};

export default tournamentService;
