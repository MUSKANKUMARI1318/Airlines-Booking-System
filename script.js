
// Check if user is logged in
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentPage = window.location.pathname;
    
    // Pages that require authentication
    const protectedPages = ['passenger.html', 'booking.html'];
    
    if (protectedPages.some(page => currentPage.includes(page)) && !isLoggedIn) {
        window.location.href = 'login.html';
        return false;
    }
    
    return !!isLoggedIn;
}

// Initialize date inputs
function initializeDates() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        if (!input.value) {
            input.value = tomorrow.toISOString().split('T')[0];
        }
        input.min = today.toISOString().split('T')[0];
    });
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Generate random ID
function generateId(length = 8) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let id = '';
    for (let i = 0; i < length; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Add notification styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 3000;
        animation: slideIn 0.3s ease;
        max-width: 400px;
    }
    
    .notification-success {
        background: #4caf50;
        color: white;
    }
    
    .notification-error {
        background: #f44336;
        color: white;
    }
    
    .notification button {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        margin-left: 10px;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(notificationStyles);

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeDates();
    checkAuth();
    
    // Add logout functionality
    const logoutLinks = document.querySelectorAll('a[href*="logout"], a[href="login.html"]');
    logoutLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.getAttribute('href').includes('logout')) {
                e.preventDefault();
                localStorage.clear();
                window.location.href = 'login.html';
            }
        });
    });
    
    // Prevent form submission on Enter key in search inputs
    const searchInputs = document.querySelectorAll('input[type="text"], input[type="search"]');
    searchInputs.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const form = input.closest('form');
                if (form) {
                    form.querySelector('button[type="submit"]').click();
                }
            }
        });
    });
});

// Export functions for use in other scripts
window.FlightUtils = {
    checkAuth,
    formatCurrency,
    generateId,
    showNotification
};