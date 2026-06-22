import axiosInstance from './axiosInstance';

// Player Management
export const getPlayers = async (params = {}) => {
  const response = await axiosInstance.get('/players/search', { params });
  return response.data;
};

export const approvePlayer = async (id) => {
  const response = await axiosInstance.post(`/players/${id}/approve`);
  return response.data;
};

export const rejectPlayer = async (id) => {
  const response = await axiosInstance.post(`/players/${id}/reject`);
  return response.data;
};

export const bulkApprovePlayers = async (ids) => {
  const promises = ids.map(id => approvePlayer(id));
  return Promise.all(promises);
};

export const bulkRejectPlayers = async (ids) => {
  const promises = ids.map(id => rejectPlayer(id));
  return Promise.all(promises);
};

// Tournament Management
export const createTournament = async (data) => {
  const response = await axiosInstance.post('/tournaments', data);
  return response.data;
};

export const updateTournament = async (id, data) => {
  const response = await axiosInstance.put(`/tournaments/${id}`, data);
  return response.data;
};

export const deleteTournament = async (id) => {
  const response = await axiosInstance.delete(`/tournaments/${id}`);
  return response.data;
};

// Tournament Registrations
export const getTournamentRegistrations = async (tournamentId, status = '') => {
  const response = await axiosInstance.get('/registrations', {
    params: { tournamentId, status }
  });
  return response.data;
};

export const approveRegistration = async (id) => {
  const response = await axiosInstance.put(`/registrations/${id}/status`, {
    status: 'CONFIRMED'
  });
  return response.data;
};

export const rejectRegistration = async (id) => {
  const response = await axiosInstance.put(`/registrations/${id}/status`, {
    status: 'REJECTED'
  });
  return response.data;
};

// Offline Payments & Status Updates
export const updateRegistrationPaymentStatus = async (id, paymentStatus) => {
  const response = await axiosInstance.put(`/registrations/${id}/status`, {
    paymentStatus
  });
  return response.data;
};

// Contact Queries
// Public/Admin Contact Query API
export const getContactMessages = async (search = '') => {
  const response = await axiosInstance.get('/admin/contacts', { params: { search } });
  return response.data;
};

export const deleteContactMessage = async (id) => {
  const response = await axiosInstance.delete(`/admin/contacts/${id}`);
  return response.data;
};

export const submitContactMessage = async (data) => {
  const response = await axiosInstance.post('/contact', data);
  return response.data;
};

export const updateContactQuery = async (id, data) => {
  const response = await axiosInstance.put(`/admin/contacts/${id}/reply`, data);
  return response.data;
};

// Feedback APIs
export const getFeedbacks = async () => {
  const response = await axiosInstance.get('/admin/feedback');
  return response.data;
};

export const deleteFeedback = async (id) => {
  const response = await axiosInstance.delete(`/admin/feedback/${id}`);
  return response.data;
};

export const submitFeedback = async (data) => {
  const response = await axiosInstance.post('/feedback', data);
  return response.data;
};

export const updateFeedbackStatus = async (id, data) => {
  const response = await axiosInstance.put(`/admin/feedback/${id}/reply`, data);
  return response.data;
};

