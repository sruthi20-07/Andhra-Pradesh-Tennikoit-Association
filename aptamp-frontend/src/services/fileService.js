import api from '../api/axios';
import axios from 'axios';

const fileService = {
  getUploadUrl: async (filename, contentType, folder = 'profile-photos') => {
    const response = await api.get(`/files/upload-url?filename=${encodeURIComponent(filename)}&contentType=${encodeURIComponent(contentType)}&folder=${folder}`);
    return response.data; // Expected response: { url, objectName }
  },

  getDownloadUrl: async (objectName) => {
    const response = await api.get(`/files/download-url?objectName=${encodeURIComponent(objectName)}`);
    return response.data; // Expected response: { url }
  },

  uploadFileViaPresignedUrl: async (presignedUrl, file) => {
    // Direct PUT upload to MinIO using the presigned URL
    const response = await axios.put(presignedUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
    });
    return response;
  }
};

export default fileService;
