import api from '../api/axios';

const calendarService = {
  getEvents: async () => {
    const response = await api.get('/calendar');
    return response.data;
  }
};

export default calendarService;
