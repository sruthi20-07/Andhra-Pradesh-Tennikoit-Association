import axiosInstance from './axiosInstance';

export const getTournaments = async (params = {}) => {
  const response = await axiosInstance.get('/tournaments', { params });
  return Array.isArray(response.data) ? response.data : (response.data?.data || response.data?.content || []);
};

export const getTournamentById = async (id) => {
  const response = await axiosInstance.get(`/tournaments/${id}`);
  return response.data;
};

export const registerForTournament = async (tournamentId, categoryId) => {
  const response = await axiosInstance.post('/registrations', { tournamentId, categoryId });
  return response.data;
};

export const getMyRegistrations = async (params = {}) => {
  const response = await axiosInstance.get('/registrations', { params });
  return response.data;
};
