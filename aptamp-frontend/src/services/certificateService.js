import api from '../api/axios';

const certificateService = {
  getCertificates: async () => {
    const response = await api.get('/certificates');
    return response.data;
  },
  issueCertificate: async (certificateData) => {
    const response = await api.post('/certificates', certificateData);
    return response.data;
  },
  verifyCertificate: async (number) => {
    const response = await api.get(`/certificates/verify?number=${encodeURIComponent(number)}`);
    return response.data;
  }
};

export default certificateService;
