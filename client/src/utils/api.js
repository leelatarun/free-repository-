import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('admin_token');
    }
    return Promise.reject(err);
  }
);

export default api;

export const seatsApi = {
  getAll: (date) => api.get('/api/seats', { params: { date } }),
  getById: (id, date) => api.get(`/api/seats/${id}`, { params: { date } }),
};

export const bookingsApi = {
  create: (data) => api.post('/api/bookings', data),
  confirmPayment: (id, payment_reference) =>
    api.patch(`/api/bookings/${id}/confirm-payment`, { payment_reference }),
  getById: (id) => api.get(`/api/bookings/${id}`),
};

export const adminApi = {
  login: (username, password) => api.post('/api/auth/login', { username, password }),
  verify: () => api.get('/api/auth/verify'),
  dashboard: () => api.get('/api/admin/dashboard'),
  getBookings: (params) => api.get('/api/admin/bookings', { params }),
  updateBooking: (id, data) => api.patch(`/api/admin/bookings/${id}`, data),
  getSeats: () => api.get('/api/admin/seats'),
  updatePricing: (data) => api.patch('/api/admin/seats/pricing', data),
};
