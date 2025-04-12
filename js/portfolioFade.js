document.addEventListener('DOMContentLoaded', () => {
    // Target both portfolio and research items
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const researchItems = document.querySelectorAll('#blog .col-lg-6.mb-5');
    
    // Control animation speed here (in seconds)
    const animationDuration = 0.6; // Adjust for faster (e.g., 0.3) or slower (e.g., 1.0)

    const observerOptions = {
        root: null, // Use viewport as root
        threshold: 0.2, // Trigger when 20% of the item is visible
        rootMargin: '0px' // No extra margin
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const item = entry.target;
                const img = item.querySelector('img');
                const title = item.querySelector('h5');
                const desc = item.querySelector('p');
                const button = item.querySelector('a'); // For research items

                // Animate in with staggered delays
                img.style.opacity = '1';
                img.style.transform = 'translateX(0)';
                img.style.transition = `opacity ${animationDuration}s ease, transform ${animationDuration}s ease`;

                title.style.opacity = '1';
                title.style.transform = 'translateX(0)';
                title.style.transition = `opacity ${animationDuration}s ease ${animationDuration * 0.33}s, transform ${animationDuration}s ease ${animationDuration * 0.33}s`;

                desc.style.opacity = '1';
                desc.style.transform = 'translateX(0)';
                desc.style.transition = `opacity ${animationDuration}s ease ${animationDuration * 0.66}s, transform ${animationDuration}s ease ${animationDuration * 0.66}s`;

                if (button) {
                    button.style.opacity = '1';
                    button.style.transform = 'translateX(0)';
                    button.style.transition = `opacity ${animationDuration}s ease ${animationDuration * 0.99}s, transform ${animationDuration}s ease ${animationDuration * 0.99}s`;
                }

                // Stop observing this item after animation
                observer.unobserve(item);
            }
        });
    }, observerOptions);

    // Apply observer to portfolio items
    portfolioItems.forEach((item) => {
        const img = item.querySelector('img');
        const title = item.querySelector('h5');
        const desc = item.querySelector('p');

        img.style.opacity = '0';
        img.style.transform = 'translateX(-50px)';
        title.style.opacity = '0';
        title.style.transform = 'translateX(-50px)';
        desc.style.opacity = '0';
        desc.style.transform = 'translateX(-50px)';

        observer.observe(item);
    });

    // Apply observer to research items
    researchItems.forEach((item) => {
        const img = item.querySelector('img');
        const title = item.querySelector('h5');
        const desc = item.querySelector('p');
        const button = item.querySelector('a');

        img.style.opacity = '0';
        img.style.transform = 'translateX(-50px)';
        title.style.opacity = '0';
        title.style.transform = 'translateX(-50px)';
        desc.style.opacity = '0';
        desc.style.transform = 'translateX(-50px)';
        if (button) {
            button.style.opacity = '0';
            button.style.transform = 'translateX(-50px)';
        }

        observer.observe(item);
    });
});