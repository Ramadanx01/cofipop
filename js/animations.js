// animations.js
export function initializeAnimations() {
    // animateBackgroundElements(); // ازيل لو مش موجودة
}

export function setupAuthAnimations() {
    const authContainer = document.querySelector('.auth-container');
    if (!authContainer) return;
    authContainer.style.opacity = 0;
    authContainer.style.transform = 'translateY(20px)';
    setTimeout(() => {
        authContainer.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        authContainer.style.opacity = 1;
        authContainer.style.transform = 'translateY(0)';
    }, 100);
    const formInputs = authContainer.querySelectorAll('input, button');
    formInputs.forEach((input, index) => {
        input.style.opacity = 0;
        input.style.transform = 'translateY(10px)';
        setTimeout(() => {
            input.style.transition = `opacity 0.5s ease-out ${index * 0.1}s, transform 0.5s ease-out ${index * 0.1}s`;
            input.style.opacity = 1;
            input.style.transform = 'translateY(0)';
        }, 300);
    });
}

export function setupProductAnimations() {
    const productCards = document.querySelectorAll('.product-item');
    if (!productCards.length) return;
    productCards.forEach(card => {
        card.style.opacity = 0;
        card.style.transform = 'translateY(50px)';
    });
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });
    productCards.forEach(card => observer.observe(card));
}

export function setupReviewAnimations() {
    const reviewCards = document.querySelectorAll('.review-card');
    if (!reviewCards.length) return;
    reviewCards.forEach(card => {
        card.style.opacity = 0;
        card.style.transform = 'translateX(-30px)';
    });
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.transition = 'opacity 0.7s ease-out, transform 0.7s ease-out';
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateX(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3, rootMargin: '0px 0px -50px 0px' });
    reviewCards.forEach(card => observer.observe(card));
}

export function setupGalleryAnimations() {
    const galleryImages = document.querySelectorAll('.gallery-image');
    if (!galleryImages.length) return;
    galleryImages.forEach((img, index) => {
        img.style.setProperty('--image-delay', index);
        img.style.opacity = 0;
    });
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = `imageFadeIn 0.6s ease forwards ${parseFloat(entry.target.style.getPropertyValue('--image-delay')) * 0.15}s`;
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    galleryImages.forEach(img => observer.observe(img));
}