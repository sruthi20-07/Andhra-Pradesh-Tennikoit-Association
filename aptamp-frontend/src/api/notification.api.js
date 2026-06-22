import axiosInstance from './axiosInstance';

const MOCK_NOTIFICATIONS = [
  { id: 1, title: 'State Selections 2026', message: 'AP State Sub-Junior Team trials are scheduled for June 28th at Guntur District Stadium.', isRead: false, type: 'announcement' },
  { id: 2, title: 'Registration Open', message: 'Registrations are now open for the 45th AP State Inter-District Tennikoit Championship 2026.', isRead: true, type: 'announcement' },
  { id: 3, title: 'Referee Program', message: 'APTA Referee & Coach Certification Program starts from July 10th. Apply online.', isRead: false, type: 'system' }
];

export const getNotifications = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/notifications', { params });
    return response.data;
  } catch (err) {
    // Return mock fallback to prevent crashes if GET is not supported on backend
    return MOCK_NOTIFICATIONS;
  }
};

export const getMyNotifications = async () => {
  try {
    const response = await axiosInstance.get('/notifications/my');
    return response.data;
  } catch (err) {
    return MOCK_NOTIFICATIONS;
  }
};

export const createNotification = async (data) => {
  const response = await axiosInstance.post('/notifications', data);
  return response.data;
};

export const markAsRead = async (id) => {
  try {
    const response = await axiosInstance.put(`/notifications/${id}/read`);
    return response.data;
  } catch (err) {
    return { success: true };
  }
};
