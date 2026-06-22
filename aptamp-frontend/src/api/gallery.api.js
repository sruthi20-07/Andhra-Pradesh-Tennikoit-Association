import axiosInstance from './axiosInstance';

export const getGalleryItems = async (params = {}) => {
  const response = await axiosInstance.get('/gallery', { params });
  return response.data;
};

export const createGalleryItem = async (data) => {
  const response = await axiosInstance.post('/admin/gallery', data);
  return response.data;
};

export const updateGalleryItem = async (id, data) => {
  const response = await axiosInstance.put(`/admin/gallery/${id}`, data);
  return response.data;
};

export const deleteGalleryItem = async (id) => {
  const response = await axiosInstance.delete(`/admin/gallery/${id}`);
  return response.data;
};
