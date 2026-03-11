import api from './api';

export const registerUser = async (email, password) => {
  const response = await api.post('/api/auth/register', {
    email,
    password,
  });
  return response.data;
};

export const loginUser = async (email, password) => {
  const response = await api.post('/api/auth/login', {
    email,
    password,
  });
  return response.data; // JWT
};

export const getLatestResume = async () => {
  const response = await api.get('/api/resume/latest');
  return response.data;
};


// export const uploadResume = async (file) => {
//   const formData = new FormData();

//   formData.append('file', {
//     uri: file.uri,
//     name: file.name,
//     type: file.mimeType,
//   });

//   const response = await api.post(
//     '/api/resume/upload',
//     formData,
//     {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     }
//   );

//   return response.data;
// };
