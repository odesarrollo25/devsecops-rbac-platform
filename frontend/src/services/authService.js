import api from './api';

export const authService = {
  login: async (username, password) => {
    // El backend espera OAuth2 Password Request Form (x-www-form-urlencoded)
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const response = await api.post('/identity/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/identity/me');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },
};