console.log('Motus Transit App Loaded');

const STORAGE_KEY = 'motus_privacy_consent';

document.addEventListener('DOMContentLoaded', () => {
    handlePrivacyModal();
    setupNavigation();
});

function handlePrivacyModal() {
    const modal = document.getElementById('privacy-modal');
    const acceptBtn = document.getElementById('accept-privacy');

    // Check if user already accepted
    const hasConsented = localStorage.getItem(STORAGE_KEY);

    if (hasConsented) {
        modal.style.display = 'none';
    } else {
        modal.style.display = 'flex';
    }

    acceptBtn.addEventListener('click', () => {
        localStorage.setItem(STORAGE_KEY, 'true');
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    });
}

function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Simply updating active state for visual feedback
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });
}

// Mock Live Data Updates
setInterval(() => {
    // In a real app, this would fetch from the Motus API
    const timeElements = document.querySelectorAll('.comparison-card.transit .time');
    // Randomly fluctuate time slightly to simulate "Live" calculation
    // This is just a visual effect for the demo
}, 5000);
