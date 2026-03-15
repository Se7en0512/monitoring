// Axios instance with interceptors
const apiClient = axios.create({
    baseURL: CONFIG.API_BASE_URL,
    timeout: CONFIG.TIMEOUT,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            removeToken();
            showPage('homePage');
            showToast('Session expired. Please login again.', 'error');
        }
        return Promise.reject(error);
    }
);

// API Functions
const API = {
    // Authentication
    register: (data) => apiClient.post('/auth/register', data),
    login: (data) => apiClient.post('/auth/login', data),
    
    // Visitors
    checkInVisitor: (data) => apiClient.post('/visitors/check-in', data),
    checkOutVisitor: (id) => apiClient.post(`/visitors/${id}/check-out`),
    getVisitorLogs: (params) => apiClient.get('/visitors/logs', { params }),
    
    // Guests
    checkInGuest: (data) => apiClient.post('/guests/check-in', data),
    checkOutGuest: (id) => apiClient.post(`/guests/${id}/check-out`),
    getGuestLogs: (params) => apiClient.get('/guests/logs', { params }),
    
    // Dashboard
    getDashboardStats: () => apiClient.get('/dashboard/stats'),
    getDailyAnalytics: () => apiClient.get('/dashboard/analytics/daily'),
    getRepeatVisitors: () => apiClient.get('/dashboard/repeat-visitors'),
    
    // Users
    getAllUsers: (params) => apiClient.get('/users', { params }),
    getUserProfile: () => apiClient.get('/users/profile'),
    deleteUser: (id) => apiClient.delete(`/users/${id}`)
};