import apiClient from './client';

// Example API service functions
export const healthCheck = async () => {
  const response = await apiClient.get('/health');
  return response.data;
};

// Add more API functions here as needed
// Example:
// export const uploadCV = async (file: File) => {
//   const formData = new FormData();
//   formData.append('file', file);
//   const response = await apiClient.post('/upload', formData, {
//     headers: {
//       'Content-Type': 'multipart/form-data',
//     },
//   });
//   return response.data;
// };

// export const getCVData = async (id: string) => {
//   const response = await apiClient.get(`/cv/${id}`);
//   return response.data;
// };
