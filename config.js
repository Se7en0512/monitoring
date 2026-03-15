// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const CONFIG = {
    API_BASE_URL,
    TOKEN_KEY: 'authToken',
    USER_KEY: 'currentUser',
    TIMEOUT: 30000,
    PAGE_LIMIT: 20
};

// Utility: Get Token
function getToken() {
    return localStorage.getItem(CONFIG.TOKEN_KEY);
}

// Utility: Save Token
function saveToken(token) {
    localStorage.setItem(CONFIG.TOKEN_KEY, token);
}

// Utility: Remove Token
function removeToken() {
    localStorage.removeItem(CONFIG.TOKEN_KEY);
    localStorage.removeItem(CONFIG.USER_KEY);
}

// Utility: Get Current User
function getCurrentUser() {
    const user = localStorage.getItem(CONFIG.USER_KEY);
    return user ? JSON.parse(user) : null;
}

// Utility: Save Current User
function saveCurrentUser(user) {
    localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(user));
}