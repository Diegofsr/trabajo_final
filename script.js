document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initMobileMenu();
    initParallax();
    initScrollAnimations();
    initSlider();
    initCounters();
    initForm();
    initBackToTop();
    initActiveNav();
});

/* ===== NAVBAR ===== */
/* ===== NAVBAR ===== */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    // En lugar de seleccionar el contenedor <a>, seleccionamos directamente la imagen <img>
    const logoImg = document.querySelector('.nav-logo img'); 
    
    // Aquí defines las rutas exactas de tus dos imágenes
    const logoArriba = 'images/tipografiablanco.png'; // El logo cuando estás arriba del todo
    const logoAlBajar = 'images/tipografia.png';      // El logo cuando haces scroll (ajusta el nombre si es otro)

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 80) {
            // Cuando bajamos
            navbar.classList.add('scrolled');
            
            // Cambiamos la imagen solo si no está ya puesta (para evitar parpadeos)
            if (logoImg.getAttribute('src') !== logoAlBajar) {
                logoImg.src = logoAlBajar;
            }
            
        } else {
            // Cuando volvemos arriba del todo
            navbar.classList.remove('scrolled');
            
            // Volvemos a poner la imagen blanca original
            if (logoImg.getAttribute('src') !== logoArriba) {
                logoImg.src = logoArriba;
            }
        }
    });
}

/* ===== MOBILE MENU ===== */
function initMobileMenu() {
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        links.classList.toggle('open');
    });

    links.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            links.classList.remove('open');
        });
    });

    document.addEventListener('click', (e) => {
        if (!links.contains(e.target) && !toggle.contains(e.target)) {
            toggle.classList.remove('active');
            links.classList.remove('open');
        }
    });
}

/* ===== PARALLAX ===== */
function initParallax() {
    const heroBg = document.getElementById('hero-bg');
    const heroSubtitle = document.getElementById('hero-subtitle');
    const heroTitle = document.getElementById('hero-title');
    const heroDesc = document.getElementById('hero-desc');
    const heroBtn = document.getElementById('hero-btn');
    const scrollIndicator = document.getElementById('scroll-indicator');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroHeight = document.getElementById('inicio').offsetHeight;

        if (scrolled < heroHeight) {
            const speed = 0.5;
            if (heroBg) {
                heroBg.style.transform = `translateY(${scrolled * speed}px)`;
            }

            const parallaxFactor = scrolled * 0.3;
            if (heroSubtitle) heroSubtitle.style.transform = `translateY(${parallaxFactor}px)`;
            if (heroTitle) heroTitle.style.transform = `translateY(${parallaxFactor * 0.5}px)`;
            if (heroDesc) heroDesc.style.transform = `translateY(${parallaxFactor}px)`;
            if (heroBtn) heroBtn.style.transform = `translateY(${parallaxFactor * 0.8}px)`;
            if (scrollIndicator) {
                scrollIndicator.style.opacity = 1 - (scrolled / 300);
            }
        }
    });
}

/* ===== SCROLL ANIMATIONS ===== */
function initScrollAnimations() {
    const reveals = document.querySelectorAll('.reveal');

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    reveals.forEach(el => observer.observe(el));
}

/* ===== SLIDER ===== */
function initSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    let currentSlide = 0;
    let autoplayInterval;

    function goToSlide(index) {
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));

        currentSlide = index;
        if (currentSlide >= slides.length) currentSlide = 0;
        if (currentSlide < 0) currentSlide = slides.length - 1;

        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoplay();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoplay();
    });

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            goToSlide(parseInt(dot.dataset.dot));
            resetAutoplay();
        });
    });

    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 5000);
    }

    function resetAutoplay() {
        clearInterval(autoplayInterval);
        startAutoplay();
    }

    startAutoplay();

    let touchStartX = 0;
    let touchEndX = 0;

    const slider = document.getElementById('slider');

    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
            resetAutoplay();
        }
    }, { passive: true });
}

/* ===== COUNTERS ===== */
function initCounters() {
    const counters = document.querySelectorAll('.counter-number');
    let hasAnimated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                counters.forEach(counter => {
                    animateCounter(counter);
                });
            }
        });
    }, { threshold: 0.5 });

    const countersSection = document.querySelector('.counters');
    if (countersSection) {
        observer.observe(countersSection);
    }
}

function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const isDecimal = el.dataset.decimal === 'true';
    const duration = 2000;
    const startTime = performance.now();

    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutCubic(progress);
        const currentValue = easedProgress * target;

        if (isDecimal) {
            el.textContent = currentValue.toFixed(1);
        } else if (target >= 1000) {
            el.textContent = Math.floor(currentValue).toLocaleString();
        } else {
            el.textContent = Math.floor(currentValue);
        }

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            if (isDecimal) {
                el.textContent = target.toFixed(1);
            } else {
                el.textContent = target.toLocaleString();
            }
        }
    }

    requestAnimationFrame(update);
}

/* ===== FORM ===== */
function initForm() {
    const form = document.getElementById('contact-form');
    const successMsg = document.getElementById('form-success');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const btn = form.querySelector('button[type="submit"]');
            const btnText = btn.querySelector('span');
            const originalText = btnText.textContent;
            btnText.textContent = 'Enviando...';
            btn.disabled = true;

            setTimeout(() => {
                btnText.textContent = originalText;
                btn.disabled = false;
                form.reset();
                successMsg.classList.add('show');

                setTimeout(() => {
                    successMsg.classList.remove('show');
                }, 3000);
            }, 1500);
        });

        form.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            input.addEventListener('blur', () => {
                input.parentElement.classList.remove('focused');
            });
        });
    }

    if (successMsg) {
        successMsg.addEventListener('click', () => {
            successMsg.classList.remove('show');
        });
    }
}

/* ===== BACK TO TOP ===== */
function initBackToTop() {
    const backToTop = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ===== ACTIVE NAV ===== */
function initActiveNav() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}
