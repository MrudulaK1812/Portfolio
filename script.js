document.addEventListener('DOMContentLoaded', function () {
    initSmoothScrolling();
    initFormHandler();
    initScrollAnimations();
    initNavHighlight();
    lazyLoadImages();
    loadDarkModePreference();
    initStatsObserver();
    initRevealOnScroll();
    initTypingEffect();
    initServiceSlider(); // ✅ initialize Slick slider only after DOM is ready
});

// 1. Smooth scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// 2. Contact form handler
function initFormHandler() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(form);
        const name = String(formData.get('name') || '').trim();
        const email = String(formData.get('email') || '').trim();
        const subject = String(formData.get('subject') || '').trim();
        const message = String(formData.get('message') || '').trim();

        if (!name || !email || !subject || !message) {
            alert('Please fill in all fields.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        const submitBtn = form.querySelector('.btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
            alert(`Thank you, ${name}! Your message has been sent.`);
            form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

// 3. Scroll-based reveal animations
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.project-card, .service-card, .stat-item').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// 4. Navigation link highlight
function initNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            if (scrollY >= section.offsetTop - 200) {
                current = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
        });
    });
}

// 5. Typing effect
function initTypingEffect() {
    const tagline = document.querySelector('.tagline');
    if (!tagline) return;

    const text = tagline.textContent;
    tagline.textContent = '';
    let i = 0;

    setTimeout(function type() {
        if (i < text.length) {
            tagline.textContent += text.charAt(i++);
            setTimeout(type, 80);
        }
    }, 1000);
}

// 6. Animated stat counters
function animateCounter(element, start, end, duration) {
    let startTime = null;

    function animate(currentTime) {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        element.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}

function initStatsObserver() {
    const aboutSection = document.getElementById('about');
    if (!aboutSection) return;

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.stat-number').forEach(stat => {
                    const num = parseInt(stat.textContent.replace(/\D/g, ''));
                    animateCounter(stat, 0, num, 2000);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statsObserver.observe(aboutSection);
}

// 7. Mobile nav toggle
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) navLinks.classList.toggle('mobile-active');
}

// 8. Scroll to top button
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('scroll', function () {
    const scrollButton = document.getElementById('scroll-to-top');
    if (scrollButton) {
        scrollButton.style.display = window.scrollY > 300 ? 'block' : 'none';
    }

    // Parallax effect on scroll
    const header = document.querySelector('header');
    if (header) {
        header.style.transform = `translateY(${window.pageYOffset * -0.5}px)`;
    }
});

// 9. Lazy loading
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => observer.observe(img));
}

// 10. Dark mode toggle
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

function loadDarkModePreference() {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
}

// 11. Reveal on scroll
function initRevealOnScroll() {
    document.querySelectorAll('section').forEach(section => section.classList.add('reveal'));
    window.addEventListener('scroll', () => {
        document.querySelectorAll('.reveal').forEach(reveal => {
            const windowHeight = window.innerHeight;
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - 150) {
                reveal.classList.add('active');
            }
        });
    });
}

// 12. Slick slider for .services-slider
function initServiceSlider() {
    if (typeof $ === 'undefined' || typeof $.fn.slick === 'undefined') return;

    if (document.querySelector('.services-slider')) {
        $('.services-slider').slick({
            slidesToShow: 2,
            slidesToScroll: 1,
            autoplay: false,
            arrows: true,
            dots: true,
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 1
                    }
                }
            ]
        });
    }
}
