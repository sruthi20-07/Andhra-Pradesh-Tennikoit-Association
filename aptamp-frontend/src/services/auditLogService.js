import api from '../api/axios';

const auditLogService = {
  getAuditLogs: async () => {
    const response = await api.get('/audit-logs');
    return response.data;
  }
};

export default auditLogService;
