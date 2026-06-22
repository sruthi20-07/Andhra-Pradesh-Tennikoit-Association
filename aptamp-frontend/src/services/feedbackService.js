import api from '../api/axios';

const feedbackService = {
  submitFeedback: async (feedback) => {
    const response = await api.post('/feedback', feedback);
    return response.data;
  },
  getAllFeedback: async () => {
    const response = await api.get('/feedback');
    return response.data;
  }
};

export default feedbackService;
