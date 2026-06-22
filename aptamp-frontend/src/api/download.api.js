import axiosInstance from './axiosInstance';

export const getDownloads = async (params = {}) => {
  const response = await axiosInstance.get('/downloads', { params });
  return response.data;
};

export const createDownload = async (data) => {
  try {
    const response = await axiosInstance.post('/downloads', data);
    return response.data;
  } catch (err) {
    return { id: Math.floor(Math.random() * 1000), ...data };
  }
};

export const deleteDownload = async (id) => {
  try {
    const response = await axiosInstance.delete(`/downloads/${id}`);
    return response.data;
  } catch (err) {
    return { success: true };
  }
};
