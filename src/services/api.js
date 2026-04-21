import axios from 'axios';

const BACKEND_URL = 'https://jobmatchbackend-okz8.onrender.com/api';
// const BACKEND_URL="/api"
const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jm_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('jm_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// ─── Seeker API ───────────────────────────────────────────────────────────────
export const seekerApi = {
  getDashboard: () => api.get('/seeker/dashboard'),
  updateProfile: (data) => api.put('/seeker/profile', data),
  respondToMatch: (matchId, status) => api.put(`/seeker/matches/${matchId}/respond`, { status }),
};

// ─── Recruiter API ────────────────────────────────────────────────────────────
export const recruiterApi = {
  getDashboard: () => api.get('/recruiter/dashboard'),
  updateProfile: (data) => api.put('/recruiter/profile', data),
  respondToMatch: (matchId, status) => api.put(`/recruiter/matches/${matchId}/respond`, { status }),
};

// ─── Jobs API ─────────────────────────────────────────────────────────────────
export const jobsApi = {
  getAll: (params) => api.get('/jobs', { params }),
  getOne: (id) => api.get(`/jobs/${id}`),
  create: (data) => api.post('/jobs', data),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`),
};

// ─── Admin API ────────────────────────────────────────────────────────────────
export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard'),
  getSeekers: (params) => api.get('/admin/seekers', { params }),
  getRecruiters: (params) => api.get('/admin/recruiters', { params }),
  getJobs: (params) => api.get('/admin/jobs', { params }),
  getMatches: (params) => api.get('/admin/matches', { params }),
  matchCandidates: (jobId) => api.get(`/admin/match-candidates/${jobId}`),
  sendMatch: (data) => api.post('/admin/send-match', data),
  toggleUser: (id) => api.put(`/admin/users/${id}/toggle`),
};

// ─── Notifications API ────────────────────────────────────────────────────────
export const notifApi = {
  getAll: (params) => api.get('/notifications', { params }),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
};
