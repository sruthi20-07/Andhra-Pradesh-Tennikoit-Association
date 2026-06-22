import api from '../api/axios';

const rankingService = {
  getStateRankings: async (categoryId) => {
    const response = await api.get(`/rankings/state?categoryId=${categoryId}`);
    return response.data;
  },

  getDistrictRankings: async (categoryId, district) => {
    const response = await api.get(`/rankings/district?categoryId=${categoryId}&district=${district}`);
    return response.data;
  },

  calculateRankings: async () => {
    const response = await api.post('/rankings/calculate');
    return response.data;
  }
};

export default rankingService;
