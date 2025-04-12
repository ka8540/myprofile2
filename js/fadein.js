document.addEventListener('DOMContentLoaded', () => {
    const targetDiv = document.querySelector('.col-lg-5.pb-4.pb-lg-0');
    const img = targetDiv.querySelector('img');

    // Set initial styles for animation
    img.style.opacity = '0';
    img.style.transform = 'translateX(-50px)';
    img.style.transition = 'opacity 1s ease, transform 0.6s ease';

    const handleScroll = () => {
        const rect = targetDiv.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;

        // Check if div is in viewport
        if (rect.top <= windowHeight * 0.8 && rect.bottom >= 0) {
            // Fade in and slide to original position
            img.style.opacity = '1';
            img.style.transform = 'translateX(0)';
        } else {
            // Fade out and slide left
            img.style.opacity = '0';
            img.style.transform = 'translateX(-50px)';
        }
    };

    // Listen for scroll events
    window.addEventListener('scroll', handleScroll);

    // Trigger once on load in case the div is already in view
    handleScroll();
});