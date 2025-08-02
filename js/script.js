// script.js
import { getCurrentUser, isAdminLoggedIn, loginUser, registerUser } from './logic.js';
import { initializeAnimations, setupAuthAnimations, setupProductAnimations, setupReviewAnimations, setupGalleryAnimations } from './animations.js';

document.addEventListener('DOMContentLoaded', async () => {
    

    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage === 'login.html') {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const username = loginForm.username.value;
                const password = loginForm.password.value;
                const user = await loginUser(username, password);
                if (user) {
                    showToastMessage(`Welcome back, ${user.username}!`, 'success');
                    setTimeout(() => {
                        window.location.href = user.isAdmin ? 'admin/dashboard.html' : 'index.html';
                    }, 1000);
                } else {
                    showToastMessage('Invalid username or password.', 'danger');
                }
            });
        }
    } else if (currentPage === 'register.html') {
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const username = registerForm.username.value;
                const password = registerForm.password.value;
                const success = await registerUser(username, password);
                if (success) {
                    showToastMessage('Registration successful! Please log in.', 'success');
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 1000);
                } else {
                    showToastMessage('Username already exists or registration failed.', 'danger');
                }
            });
        }
    } else if (currentPage === 'menu.html') {
        document.querySelectorAll('.filter-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const category = e.target.dataset.filter;
                filterProducts(category);
            });
        });
        filterProducts('all');
    }
});

function filterProducts(category) {
    const productCards = document.querySelectorAll('.product-card');
    if (!productCards.length) return;
    productCards.forEach(card => {
        const productCategory = card.dataset.category;
        card.style.display = (category === 'all' || productCategory === category) ? 'block' : 'none';
    });
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.classList.toggle('active', button.dataset.filter === category);
    });
}