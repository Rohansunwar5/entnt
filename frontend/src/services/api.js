import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
};

export const companiesAPI = {
  getAll: () => api.get('/company/companies'),
  getById: (id) => api.get(`/company/companies/${id}`),
  create: (data) => api.post('/company/companies', data),
  update: (id, data) => api.put(`/company/companies/${id}`, data),
  delete: (id) => api.delete(`/company/companies/${id}`),
  toggleHighlight: (id) => api.patch(`/company/companies/${id}/highlight`),
};

export const communicationMethodsAPI = {
  getAll: () => api.get('/communication/communication-methods'),
  create: (data) => api.post('/communication/communication-methods', data),
  update: (id, data) => api.put(`/communication/communication-methods/${id}`, data),
  updateSequence: (id, data) => api.patch(`/communication/communication-methods/${id}/sequence`, data),
};

export const communicationsAPI = {
  create: (data) => api.post('/communication/communication-records', data),
  getCompanyCommunications: (companyId) =>
    api.get(`/communication/communication-records/company/${companyId}`),
  getLatest: () => api.get('/communication/communication-records/latest'),
  getOverdue: () => api.get('/communication/communication-records/overdue'),
  getToday: () => api.get('/communication/communication-records/today'),
};

export const scheduleAPI = {
  getAll: () => api.get('/schedule'),
  create: (data) => api.post('/schedule', data),
  update: (id, data) => api.put(`/schedule/${id}`, data),
  delete: (id) => api.delete(`/schedule/${id}`),
};

export const analyticsAPI = {
  getFrequency: (params) => api.get('/analytics/communication-frequency', { params }),
  getEffectiveness: (params) => api.get('/analytics/effectiveness-metrics', { params }),
  getTrends: (params) => api.get('/analytics/overdue-trends', { params }),
  getActivity: () => api.get('/analytics/activity-log'),
  exportReports: (params) => api.get('/analytics/export-reports', { params }),
};

export default api;