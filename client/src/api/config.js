import axio from 'axios';

const API_URL = 'http://localhost:5000/';
const axioInstance = axio.create({
  baseURL: API_URL,
  // headers: {
  //   'Content-Type': 'application/json',
  // },
});

axioInstance.interceptors.request.use(
  (config) => {
    // الشرط: إذا كان الـ request من نوع GET
    if (config.method?.toLowerCase() === 'get') {
      // قم بحذف header الـ Content-Type
      delete config.headers['Content-Type'];
    }
      if (!config.data && config.method?.toLowerCase() === 'get') {
      delete config.headers['Content-Type'];
    }
     return config;
  },
  (error) => Promise.reject(error)
);
export  {axioInstance};

export const schoolApi = {
  getAll: () => axioInstance.get('/school'),
  // getById: (id) => API_URL.get(`/school/${id}`),
  create: (schoolData) => axioInstance.post('/school',  {schoolData} ),
  update: (id, schoolData) => axioInstance.put(`/school/${id}`, schoolData),
  delete: (id) => axioInstance.delete(`/school/${id}`),
};

export const studentApi = {
  getBySchoolBySpeacial: (schoolId,speacialId) => axioInstance.get(`/student?schoolId=${schoolId}?speacialId=${speacialId}`),
  create: (studentData) => axioInstance.post('/student', studentData),
  update: (id, studentData) => axioInstance.put(`/student/${id}`, studentData),
  delete: (id) => axioInstance.delete(`/student/${id}`),
};

// // api/config.js
// import axios from 'axios';

// export const axioInstance = axios.create({
//   baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Interceptor لإضافة التوكن إذا كان موجوداً
// axioInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Interceptor للردود
// axioInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem('token');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// export default axioInstance;

