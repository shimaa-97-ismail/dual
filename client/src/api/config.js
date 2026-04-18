import axio from 'axios';


const axioInstance = axio.create({
  baseURL: import.meta.env.REACT_APP_API_URL ||'http://localhost:5000/',
  timeout: 10000,
  // headers: {
  //   'Content-Type': 'application/json',
  // },
});

axioInstance.interceptors.request.use(
   (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
axioInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user'); // if you store user separately
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
export  {axioInstance};

// export const schoolApi = {
//   getAll: () => axioInstance.get('/school'),
//   // getById: (id) => API_URL.get(`/school/${id}`),
//   create: (schoolData) => axioInstance.post('/school',  {schoolData} ),
//   update: (id, schoolData) => axioInstance.put(`/school/${id}`, schoolData),
//   delete: (id) => axioInstance.delete(`/school/${id}`),
// };

// export const studentApi = {
//   getBySchoolBySpeacial: (schoolId,speacialId) => axioInstance.get(`/student?schoolId=${schoolId}?speacialId=${speacialId}`),
//   create: (studentData) => axioInstance.post('/student', studentData),
//   update: (id, studentData) => axioInstance.put(`/student/${id}`, studentData),
//   delete: (id) => axioInstance.delete(`/student/${id}`),
// };

