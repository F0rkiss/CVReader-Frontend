import apiClient from './client';

export const classifyCV = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await apiClient.post('/api/cv/classify', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const classifyReadCV = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await apiClient.post('/api/cv/read', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const fullAnalysisCV = async (file: File, expectedText: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('expected_text', expectedText);
  const response = await apiClient.post('/api/cv/read-with-metrics', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const testOCR = async (file: File, expectedText: string, engine: 'tesseract' | 'easyocr' | 'paddleocr') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('expected_text', expectedText);
  const response = await apiClient.post(`/api/cv/test/${engine}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
