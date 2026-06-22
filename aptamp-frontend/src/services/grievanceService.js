import api from '../api/axios';

const grievanceService = {
  getGrievances: async () => {
    const response = await api.get('/grievances');
    return response.data;
  },
  createGrievance: async (grievance) => {
    const response = await api.post('/grievances', grievance);
    return response.data;
  },
  resolveGrievance: async (id, resolutionDetails) => {
    const response = await api.put(`/grievances/${id}/resolve`, { resolutionDetails });
    return response.data;
  }
};

export default grievanceService;
