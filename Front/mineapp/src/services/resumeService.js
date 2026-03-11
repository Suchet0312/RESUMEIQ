import api from './api';

export const uploadResume = async (file) => {
  const formData = new FormData();

  formData.append('file', {
    uri: file.uri,
    name: file.name,
    type: file.mimeType || 'application/pdf',
  });

  const response = await api.post(
    '/api/resume/upload',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
};
export const getResumeHistory = async () => {
  const response = await api.get('/api/resume/history');
  return response.data;
};

export const analyzeResume = async () => {
  const response = await api.post('/api/resume/analyze');
  return response.data;
};