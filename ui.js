// UI Management Functions

// Toast Notifications
function showToast(message, type = 'info', duration = 3000) {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Loading Spinner
function showLoading(show = true) {
    const spinner = document.getElementById('loadingSpinner');
    if (show) {
        spinner.classList.add('show');
    } else {
        spinner.classList.remove('show');
    }
}

// Page Navigation
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
    });
    
    // Show selected page
    const page = document.getElementById(pageId);
    if (page) {
        page.classList.add('active');
        window.scrollTo(0, 0);
    }
    
    // Initialize page-specific content
    if (pageId === 'visitorPage') {
        setTimeout(() => {
            initializeChartsForVisitor();
            displayRepeatVisitors();
        }, 100);
    } else if (pageId === 'dashboardPage') {
        updateDashboard();
    }
}

// Form Validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^(\+\d{1,3}[- ]?)?\d{10,}$/;
    return re.test(phone);
}

function showFormError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}Error`);
    
    if (field) {
        field.classList.add('error');
    }
    if (errorElement) {
        errorElement.textContent = message;
    }
}

function clearFormError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}Error`);
    
    if (field) {
        field.classList.remove('error');
    }
    if (errorElement) {
        errorElement.textContent = '';
    }
}

// Password Toggle
function togglePasswordVisibility(fieldId) {
    const field = document.getElementById(fieldId);
    const button = event.currentTarget;
    
    if (field.type === 'password') {
        field.type = 'text';
        button.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        field.type = 'password';
        button.innerHTML = '<i class="fas fa-eye"></i>';
    }
}

// Keyboard Navigation
function handleKeyPress(event, pageId) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        showPage(pageId);
    }
}

// Modal Management
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
    }
}

function closeModal(modalId = 'idCardModal') {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
    }
}

// Tab Switching
function switchTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(t => {
        t.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-btn').forEach(b => {
        b.classList.remove('active');
    });
    
    // Show selected tab
    const tabContent = document.getElementById(`${tabName}-tab`);
    if (tabContent) {
        tabContent.classList.add('active');
    }
    
    // Add active class to clicked button
    if (event && event.target) {
        event.target.classList.add('active');
    }
}