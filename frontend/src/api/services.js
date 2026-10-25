import api, { getErrorMessage } from './axios';

export { getErrorMessage };

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

export const sessionService = {
  list: (params) => api.get('/sessions', { params }),
  get: (id) => api.get(`/sessions/${id}`),
  create: (data) => api.post('/sessions', data),
  update: (id, data) => api.put(`/sessions/${id}`, data),
  remove: (id) => api.delete(`/sessions/${id}`),
  subjects: () => api.get('/sessions/subjects/list'),
};

export const goalService = {
  list: (params) => api.get('/goals', { params }),
  set: (data) => api.post('/goals', data),
  remove: (id) => api.delete(`/goals/${id}`),
};

export const analyticsService = {
  dashboard: () => api.get('/analytics/dashboard'),
  charts: (period, params) => api.get('/analytics/charts', { params: { period, ...params } }),
  calendar: (params) => api.get('/analytics/calendar', { params }),
};

export const userService = {
  updateProfile: (data) => api.put('/users/profile', data),
  updatePreferences: (data) => api.put('/users/preferences', data),
  changePassword: (data) => api.put('/users/password', data),
};
