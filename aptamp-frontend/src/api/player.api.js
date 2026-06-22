import axiosInstance from './axiosInstance';

export const getProfile = async () => {
  const response = await axiosInstance.get('/players/profile');
  return response.data;
};

export const getPlayerById = async (id) => {
  const response = await axiosInstance.get(`/players/${id}`);
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await axiosInstance.put('/players/profile', data);
  return response.data;
};

export const updatePlayer = async (id, data) => {
  const response = await axiosInstance.put(`/players/${id}`, data);
  return response.data;
};

export const searchPlayers = async (params = {}) => {
  const response = await axiosInstance.get('/players/search', { params });
  return response.data;
};

export const approvePlayer = async (id) => {
  const response = await axiosInstance.post(`/players/${id}/approve`);
  return response.data;
};

export const rejectPlayer = async (id) => {
  const response = await axiosInstance.post(`/players/${id}/reject`);
  return response.data;
};

export const uploadFile = async (file, folder = 'profile-photos') => {
  const filename = file.name;
  const contentType = file.type || 'application/octet-stream';
  
  // 1. Get upload URL
  const uploadUrlResponse = await axiosInstance.get('/files/upload-url', {
    params: { filename, contentType, folder }
  });
  
  const { url, objectName } = uploadUrlResponse.data;
  
  // 2. PUT the actual file
  await axiosInstance.put(url, file, {
    headers: {
      'Content-Type': contentType
    }
  });
  
  // Return the download url link
  return `http://localhost:8082/api/files/download?objectName=${objectName}`;
};
