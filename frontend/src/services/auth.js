import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const authService = {
    async login(email, password) {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                email,
                password
            }, {
                withCredentials: true
            });
            
            if (response.data.token) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'An error occurred during login' };
        }
    },

    async signup(userData) {
        try {
            const response = await axios.post(`${API_URL}/auth/signup`, userData, {
                withCredentials: true
            });
            
            if (response.data.token) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'An error occurred during signup' };
        }
    },

    logout() {
        localStorage.removeItem('user');
    },

    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    getToken() {
        const user = this.getCurrentUser();
        return user?.token;
    },

    isAuthenticated() {
        return !!this.getToken();
    }
};

// Add axios interceptor for token
axios.interceptors.request.use(
    (config) => {
        const token = authService.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default authService; 