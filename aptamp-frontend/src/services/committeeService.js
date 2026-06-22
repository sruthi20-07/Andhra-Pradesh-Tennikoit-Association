import api from '../api/axios';

const committeeService = {
  getMembers: async () => {
    const response = await api.get('/committee');
    return response.data;
  }
};

export default committeeService;
