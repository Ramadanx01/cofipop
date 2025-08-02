// Function to show toast notifications
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        console.error('Toast container not found!');
        return;
    }

    const toastElement = document.createElement('div');
    toastElement.classList.add('toast', 'align-items-center', 'text-white', `bg-${type}`, 'border-0');
    toastElement.setAttribute('role', 'alert');
    toastElement.setAttribute('aria-live', 'assertive');
    toastElement.setAttribute('aria-atomic', 'true');
    toastElement.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;

    toastContainer.appendChild(toastElement);
    const bsToast = new bootstrap.Toast(toastElement);
    bsToast.show();

    // Auto-hide after 3 seconds
    setTimeout(() => bsToast.hide(), 3000);

    // Remove toast element after it's hidden to clean up DOM
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
}

// Common logout functionality
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('navbarLogoutLinkBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            // In a real backend scenario, you would send a request to logout
            // e.g., invalidate the token on the server
            // await fetch('/api/logout', { method: 'POST' });

            localStorage.removeItem('loggedInUser'); // Remove client-side flag
            // Optionally, remove any stored authentication tokens
            localStorage.removeItem('authToken');

            showToast('Logged out successfully', 'success');
            setTimeout(() => window.location.href = '../index.html', 1000);
        });
    }

    // Example of checking login status (basic client-side check)
    // In a real app, this would involve validating a token with the backend
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser && !window.location.pathname.includes('index.html')) {
        // Redirect to login page if not logged in and not already on index.html
        // window.location.href = '../index.html';
        // For development, we'll allow access to see the UI.
        // In production, this redirect would be enforced.
        console.warn("User not logged in. In a production app, this would redirect to login.");
    }
});

// Placeholder for API utility functions (will be expanded in page-specific JS for demonstration)
// In a real application, you might have a single 'api.js' with all fetch wrappers
async function fetchData(url, method = 'GET', data = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Include auth token if available
        },
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Server error' }));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API call error:', error);
        showToast(`Server connection failed: ${error.message}`, 'danger');
        throw error; // Re-throw to be handled by specific page logic
    }
}

// Function to set language and direction
function setLanguage(lang) {
    if (lang === 'ar') {
        document.documentElement.setAttribute('lang', 'ar');
        document.documentElement.setAttribute('dir', 'rtl');
        // You might need to reload specific translated text elements here
        // or load a separate Arabic translation file
    } else {
        document.documentElement.setAttribute('lang', 'en');
        document.documentElement.setAttribute('dir', 'ltr');
        // Load English text
    }
    // Store user preference
    localStorage.setItem('appLang', lang);
}

// Apply saved language preference on load
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('appLang') || 'en'; // Default to English
    setLanguage(savedLang);

    // Example language switcher button (you'd add this to your navbar or settings)
    const langSwitcherBtn = document.getElementById('languageSwitcher');
    if (langSwitcherBtn) {
        langSwitcherBtn.addEventListener('click', () => {
            const currentLang = localStorage.getItem('appLang');
            const newLang = currentLang === 'ar' ? 'en' : 'ar';
            setLanguage(newLang);
            // Reload page to apply full translation if content is hardcoded in HTML
            // For dynamic content, you'd re-render sections.
            location.reload();
        });
    }
});

// ✅ Existing code untouched...

// Function to show toast notifications
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        console.error('Toast container not found!');
        return;
    }

    const toastElement = document.createElement('div');
    toastElement.classList.add('toast', 'align-items-center', 'text-white', `bg-${type}`, 'border-0');
    toastElement.setAttribute('role', 'alert');
    toastElement.setAttribute('aria-live', 'assertive');
    toastElement.setAttribute('aria-atomic', 'true');
    toastElement.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;

    toastContainer.appendChild(toastElement);
    const bsToast = new bootstrap.Toast(toastElement);
    bsToast.show();

    // Auto-hide after 3 seconds
    setTimeout(() => bsToast.hide(), 3000);

    // Remove toast element after it's hidden to clean up DOM
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
}

// ✅ Added reusable loading indicator
function showLoading(btn) {
    btn.disabled = true;
    btn.dataset.originalText = btn.innerHTML;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span> Loading...`;
}
function hideLoading(btn) {
    btn.disabled = false;
    btn.innerHTML = btn.dataset.originalText || 'Submit';
}

// ✅ Logout and language handling
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('navbarLogoutLinkBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            localStorage.removeItem('loggedInUser');
            localStorage.removeItem('authToken');
            showToast('Logged out successfully', 'success');
            setTimeout(() => window.location.href = '../index.html', 1000);
        });
    }

    const loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser && !window.location.pathname.includes('index.html')) {
        console.warn("User not logged in. In a production app, this would redirect to login.");
    }

    const savedLang = localStorage.getItem('appLang') || 'en';
    setLanguage(savedLang);

    const langSwitcherBtn = document.getElementById('languageSwitcher');
    if (langSwitcherBtn) {
        langSwitcherBtn.addEventListener('click', () => {
            const currentLang = localStorage.getItem('appLang');
            const newLang = currentLang === 'ar' ? 'en' : 'ar';
            setLanguage(newLang);
            location.reload();
        });
    }
});

// ✅ Reusable fetch function
async function fetchData(url, method = 'GET', data = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Server error' }));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API call error:', error);
        showToast(`Server connection failed: ${error.message}`, 'danger');
        throw error;
    }
}

//  Utility to format currency (اختياري لعرض السعر في المستقبل)
function formatCurrency(amount, currency = 'EGP') {
    return new Intl.NumberFormat('en-EG', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2
    }).format(amount);
}

//  Set language and direction
function setLanguage(lang) {
    if (lang === 'ar') {
        document.documentElement.setAttribute('lang', 'ar');
        document.documentElement.setAttribute('dir', 'rtl');
    } else {
        document.documentElement.setAttribute('lang', 'en');
        document.documentElement.setAttribute('dir', 'ltr');
    }
    localStorage.setItem('appLang', lang);
}

// Function to show toast notifications
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        console.error('Toast container not found!');
        return;
    }

    const toastElement = document.createElement('div');
    toastElement.classList.add('toast', 'align-items-center', 'text-white', `bg-${type}`, 'border-0');
    toastElement.setAttribute('role', 'alert');
    toastElement.setAttribute('aria-live', 'assertive');
    toastElement.setAttribute('aria-atomic', 'true');
    toastElement.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;

    toastContainer.appendChild(toastElement);
    const bsToast = new bootstrap.Toast(toastElement);
    bsToast.show();

    setTimeout(() => bsToast.hide(), 3000);

    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
}

// ✅ Show loading spinner on a button
function showLoading(button) {
    if (!button) return;
    button.disabled = true;
    button.dataset.originalText = button.innerHTML;
    button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...`;
}

// ✅ Hide loading spinner from a button
function hideLoading(button) {
    if (!button) return;
    button.disabled = false;
    button.innerHTML = button.dataset.originalText || 'Submit';
}

// ✅ Validate email format (for future use)
function isValidEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}

// Common logout functionality
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('navbarLogoutLinkBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();

            localStorage.removeItem('loggedInUser');
            localStorage.removeItem('authToken');

            showToast('Logged out successfully', 'success');
            setTimeout(() => window.location.href = '../index.html', 1000);
        });
    }

    // ✅ Redirect unauthenticated users in production
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser && !window.location.pathname.includes('index.html')) {
        // In production, uncomment the following line:
        // window.location.href = '../index.html';
        console.warn("User not logged in. In production, this would redirect to login.");
    }
});

// ✅ Wrapper for API calls
async function fetchData(url, method = 'GET', data = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Server error' }));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API call error:', error);
        showToast(`Server error: ${error.message}`, 'danger');
        throw error;
    }
}

// ✅ Set language and direction
function setLanguage(lang) {
    if (lang === 'ar') {
        document.documentElement.setAttribute('lang', 'ar');
        document.documentElement.setAttribute('dir', 'rtl');
    } else {
        document.documentElement.setAttribute('lang', 'en');
        document.documentElement.setAttribute('dir', 'ltr');
    }
    localStorage.setItem('appLang', lang);
}

// ✅ Apply language on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('appLang') || 'en';
    setLanguage(savedLang);

    const langSwitcherBtn = document.getElementById('languageSwitcher');
    if (langSwitcherBtn) {
        langSwitcherBtn.addEventListener('click', () => {
            const currentLang = localStorage.getItem('appLang');
            const newLang = currentLang === 'ar' ? 'en' : 'ar';
            setLanguage(newLang);
            location.reload();
        });
    }
});
