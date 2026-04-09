import axios from 'axios';

const API = axios.create({ baseURL: "http://localhost:8000/api" });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');
export const createStudentProfile = (data) => API.post('/auth/student/profile', data);
export const createHRProfile = (data) => API.post('/auth/hr/profile', data);

// Jobs
export const getJobs = () => API.get('/jobs');
export const getJob = (id) => API.get(`/jobs/${id}`);
export const createJob = (data) => API.post('/jobs', data);
export const updateJob = (id, data) => API.put(`/jobs/${id}`, data);
export const deleteJob = (id) => API.delete(`/jobs/${id}`);

// Applications
export const applyForJob = (data) => API.post('/applications', data);
export const getMyApplications = () => API.get('/applications/my');

// Resumes
export const uploadResume = (applicationId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  return API.post(`/resumes/upload/${applicationId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// HR
export const getHRDashboard = () => API.get('/hr/dashboard');
export const getJobApplications = (jobId) => API.get(`/hr/applications/${jobId}`);
export const selectCandidate = (data) => API.post('/hr/select-candidate', data);
export const shortlistCandidate = (id) => API.post(`/hr/shortlist/${id}`);
export const rejectCandidate = (id) => API.post(`/hr/reject/${id}`);

export const triggerRAG = (applicationId) =>
  API.post(`/rag/analyze/${applicationId}`);
export const getRAGResult = (applicationId) =>
  API.get(`/rag/result/${applicationId}`);