import api from '../api/axios';

const downloadService = {
  getDownloads: async () => {
    const response = await api.get('/downloads');
    return response.data;
  }
};

export default downloadService;
