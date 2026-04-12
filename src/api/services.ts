import apiClient from './client';

export const classifyCV = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await apiClient.post('/api/cv/classify', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const classifyReadCV = async (
  file: File,
  includePreprocessedImage?: boolean,
) => {
  const formData = new FormData();
  formData.append('file', file);
  const params = includePreprocessedImage
    ? { include_preprocessed_image: true }
    : undefined;
  const response = await apiClient.post('/api/cv/read', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    params,
  });
  return response.data;
};

export const fullAnalysisCV = async (
  file: File,
  expectedText: string,
  includePreprocessedImage?: boolean,
) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('ground_truth', expectedText);
  const params = includePreprocessedImage
    ? { include_preprocessed_image: true }
    : undefined;
  const response = await apiClient.post('/api/cv/read-with-metrics', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    params,
  });
  return response.data;
};

export const testOCR = async (
  file: File,
  expectedText: string,
  engine: 'tesseract' | 'easyocr' | 'paddleocr',
  includePreprocessedImage?: boolean,
) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('ground_truth', expectedText);
  const params = includePreprocessedImage
    ? { include_preprocessed_image: true }
    : undefined;
  const response = await apiClient.post(`/api/cv/test/${engine}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    params,
  });
  return response.data;
};
