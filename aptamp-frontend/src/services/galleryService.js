import api from '../api/axios';

const galleryService = {
  getItems: async (type = '') => {
    const url = type ? `/gallery?type=${type}` : '/gallery';
    const response = await api.get(url);
    return response.data;
  }
};

export default galleryService;
