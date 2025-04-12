document.addEventListener('DOMContentLoaded', () => {
    // Target qualification items (education and experience)
    const qualificationItems = document.querySelectorAll('#qualification .position-relative.mb-4');
    
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
                const icon = item.querySelector('i');
                const title = item.querySelector('h5');
                const subtitle = item.querySelector('p.mb-2');
                // Select all non-.mb-2 paragraphs (e.g., GPA and description)
                const paragraphs = item.querySelectorAll('p:not(.mb-2)');
                const button = item.querySelector('a'); // For bachelor's certificate button

                // Animate in with staggered delays
                if (icon) {
                    icon.style.opacity = '1';
                    icon.style.transform = 'translateX(0)';
                    icon.style.transition = `opacity ${animationDuration}s ease, transform ${animationDuration}s ease`;
                }

                if (title) {
                    title.style.opacity = '1';
                    title.style.transform = 'translateX(0)';
                    title.style.transition = `opacity ${animationDuration}s ease ${animationDuration * 0.33}s, transform ${animationDuration}s ease ${animationDuration * 0.33}s`;
                }

                if (subtitle) {
                    subtitle.style.opacity = '1';
                    subtitle.style.transform = 'translateX(0)';
                    subtitle.style.transition = `opacity ${animationDuration}s ease ${animationDuration * 0.66}s, transform ${animationDuration}s ease ${animationDuration * 0.66}s`;
                }

                // Animate all non-.mb-2 paragraphs with increasing delays
                paragraphs.forEach((para, index) => {
                    para.style.opacity = '1';
                    para.style.transform = 'translateX(0)';
                    // Stagger each paragraph (e.g., GPA at 0.99s, description at 1.32s)
                    const delay = animationDuration * (0.99 + index * 0.33);
                    para.style.transition = `opacity ${animationDuration}s ease ${delay}s, transform ${animationDuration}s ease ${delay}s`;
                });

                if (button) {
                    button.style.opacity = '1';
                    button.style.transform = 'translateX(0)';
                    // Button delay comes after paragraphs
                    const buttonDelay = animationDuration * (0.99 + paragraphs.length * 0.33);
                    button.style.transition = `opacity ${animationDuration}s ease ${buttonDelay}s, transform ${animationDuration}s ease ${buttonDelay}s`;
                }

                // Stop observing this item after animation
                observer.unobserve(item);
            }
        });
    }, observerOptions);

    // Apply observer to qualification items
    qualificationItems.forEach((item) => {
        const icon = item.querySelector('i');
        const title = item.querySelector('h5');
        const subtitle = item.querySelector('p.mb-2');
        // Select all non-.mb-2 paragraphs
        const paragraphs = item.querySelectorAll('p:not(.mb-2)');
        const button = item.querySelector('a');

        if (icon) {
            icon.style.opacity = '0';
            icon.style.transform = 'translateX(-50px)';
        }
        if (title) {
            title.style.opacity = '0';
            title.style.transform = 'translateX(-50px)';
        }
        if (subtitle) {
            subtitle.style.opacity = '0';
            subtitle.style.transform = 'translateX(-50px)';
        }
        paragraphs.forEach((para) => {
            para.style.opacity = '0';
            para.style.transform = 'translateX(-50px)';
        });
        if (button) {
            button.style.opacity = '0';
            button.style.transform = 'translateX(-50px)';
        }

        observer.observe(item);
    });
});