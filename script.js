// ============================================
// ANASMADEIT PORTFOLIO - JavaScript
// Premium Interactions & Animations
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();
    initLoader();
    initSmoothScroll();
    initBottomNav();
    initScrollAnimations();
    initFormHandling();
    initParallax();
});

// ============================================
// CUSTOM CURSOR
// ============================================
function initCustomCursor() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    if (!cursor || !follower) return;
    
    // Check if touch device
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        cursor.style.display = 'none';
        follower.style.display = 'none';
        document.body.classList.remove('custom-cursor');
        return;
    }
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let followerX = 0;
    let followerY = 0;
    
    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Smooth cursor animation
    function animateCursor() {
        // Main cursor - fast follow
        cursorX += (mouseX - cursorX) * 0.25;
        cursorY += (mouseY - cursorY) * 0.25;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        // Follower - smooth delayed follow
        followerX += (mouseX - followerX) * 0.12;
        followerY += (mouseY - followerY) * 0.12;
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Interactive elements
    const interactiveElements = document.querySelectorAll(
        'a, button, .portfolio-item, .result-card, .quality-item, ' +
        '.contact-link, .nav-item, .btn, [role="button"]'
    );
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            follower.classList.add('hover');
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            follower.classList.remove('hover');
        });
    });
    
    // Text inputs
    const textInputs = document.querySelectorAll('input[type="text"], input[type="email"], textarea');
    
    textInputs.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('text');
            follower.classList.add('text');
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('text');
            follower.classList.remove('text');
        });
    });
    
    // Click effect
    document.addEventListener('mousedown', () => {
        cursor.classList.add('clicking');
        follower.classList.add('clicking');
    });
    
    document.addEventListener('mouseup', () => {
        cursor.classList.remove('clicking');
        follower.classList.remove('clicking');
    });
    
    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        follower.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        follower.style.opacity = '0.5';
    });
}

// ============================================
// PAGE LOADER
// ============================================
function initLoader() {
    const loader = document.querySelector('.loader');
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.style.overflow = '';
            
            // Trigger initial animations after loader
            setTimeout(() => {
                animateOnScroll();
            }, 100);
        }, 800);
    });
    
    // Fallback if load event doesn't fire
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 2000);
}

// ============================================
// SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const offsetTop = target.offsetTop - 20;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// BOTTOM NAVIGATION - FLOATING PILL
// ============================================
function initBottomNav() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('section[id]');
    let lastScrollTop = 0;
    const bottomNav = document.querySelector('.bottom-nav');
    let scrollTimeout;
    
    // Update active state on scroll
    function updateActiveNav() {
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('data-section') === sectionId) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Hide/show nav on scroll direction
    function handleNavVisibility() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        
        // Always show at top or bottom of page
        if (scrollTop < 100 || scrollTop > maxScroll - 100) {
            bottomNav.classList.remove('hidden');
            lastScrollTop = scrollTop;
            return;
        }
        
        // Hide on scroll down, show on scroll up
        if (scrollTop > lastScrollTop && scrollTop > 300) {
            bottomNav.classList.add('hidden');
        } else {
            bottomNav.classList.remove('hidden');
        }
        
        lastScrollTop = scrollTop;
    }
    
    // Throttled scroll handler
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateActiveNav();
                handleNavVisibility();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Initial state
    updateActiveNav();
    
    // Click handling with animation
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Remove active from all
            navItems.forEach(i => i.classList.remove('active'));
            // Add active to clicked
            this.classList.add('active');
            
            // Scale animation
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Show nav on hover near bottom
    document.addEventListener('mousemove', (e) => {
        if (e.clientY > window.innerHeight - 100) {
            bottomNav.classList.remove('hidden');
        }
    });
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
    // Elements to animate
    const animatedElements = document.querySelectorAll(
        '.section-header, .portfolio-item, .result-card, .quality-item, ' +
        '.about-content, .visual-card, .contact-content, .contact-form-wrapper, ' +
        '.testimonial-highlight'
    );
    
    // Create observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animation delay
                const delay = (entry.target.dataset.delay || 0) * 100;
                
                setTimeout(() => {
                    entry.target.classList.add('show');
                }, delay);
                
                // Optionally unobserve after animation
                // observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Add initial state and observe
    animatedElements.forEach((el, index) => {
        el.dataset.delay = index % 6;
        observer.observe(el);
    });
}

// Immediate animation for visible elements
function animateOnScroll() {
    const elements = document.querySelectorAll('.portfolio-item, .result-card, .quality-item');
    
    elements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
        
        if (isVisible) {
            setTimeout(() => {
                el.classList.add('show');
            }, index * 100);
        }
    });
}

// ============================================
// FORM HANDLING
// ============================================
function initFormHandling() {
    const form = document.getElementById('contactForm');
    
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btn = form.querySelector('button[type="submit"]');
        const originalContent = btn.innerHTML;
        
        // Loading state
        btn.disabled = true;
        btn.innerHTML = `
            <span>Sending...</span>
            <svg class="spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
        `;
        
        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Success state
        btn.innerHTML = `
            <span>Message Sent!</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
            </svg>
        `;
        btn.style.background = '#10b981';
        
        // Reset form
        form.reset();
        
        // Reset button after delay
        setTimeout(() => {
            btn.innerHTML = originalContent;
            btn.style.background = '';
            btn.disabled = false;
        }, 3000);
    });
    
    // Input focus effects
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
        });
    });
}

// ============================================
// PARALLAX EFFECTS
// ============================================
function initParallax() {
    const floatingThumbs = document.querySelectorAll('.float-thumb');
    
    if (floatingThumbs.length === 0) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });
    
    function animateParallax() {
        currentX += (mouseX - currentX) * 0.05;
        currentY += (mouseY - currentY) * 0.05;
        
        floatingThumbs.forEach((thumb, index) => {
            const speed = (index + 1) * 10;
            const x = currentX * speed;
            const y = currentY * speed;
            
            thumb.style.transform = `translate(${x}px, ${y}px)`;
        });
        
        requestAnimationFrame(animateParallax);
    }
    
    animateParallax();
}

// ============================================
// PORTFOLIO HOVER EFFECTS
// ============================================
document.querySelectorAll('.portfolio-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transition = 'all 0.3s ease';
    });
});

// ============================================
// INTERSECTION OBSERVER FOR STATS
// ============================================
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        
        if (element.textContent.includes('+')) {
            element.textContent = '+' + value + '%';
        } else if (element.textContent.includes('M')) {
            element.textContent = value + 'M+';
        } else if (element.textContent.includes('%')) {
            element.textContent = value + '%';
        } else {
            element.textContent = value + '+';
        }
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// ============================================
// UTILITY: Add CSS for spin animation
// ============================================
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    .spin {
        animation: spin 1s linear infinite;
    }
    
    /* Smooth page transitions */
    .main-content {
        opacity: 0;
        animation: fadeIn 0.5s ease forwards;
        animation-delay: 0.3s;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    /* Focus styles for form */
    .form-group.focused label {
        color: var(--teal);
    }
`;
document.head.appendChild(style);

// ============================================
// KEYBOARD NAVIGATION
// ============================================
document.addEventListener('keydown', (e) => {
    // Escape key closes any modals (future use)
    if (e.key === 'Escape') {
        // Future modal handling
    }
});

// ============================================
// PERFORMANCE: Lazy load images
// ============================================
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const lazyLoadScript = document.createElement('script');
    lazyLoadScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(lazyLoadScript);
}

// ============================================
// RESIZE HANDLER
// ============================================
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Recalculate any layout-dependent features
    }, 250);
});

console.log('AnasMadeIt Portfolio - Loaded Successfully');
