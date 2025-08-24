// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Toggle body scroll
    if (hamburger.classList.contains('active')) {
        document.body.classList.add('menu-open');
    } else {
        document.body.classList.remove('menu-open');
    }
    
    // Add hamburger animation
    const spans = hamburger.querySelectorAll('span');
    if (hamburger.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
        
        // Reset hamburger animation
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// Close mobile menu when clicking on social icons
document.querySelectorAll('.mobile-social-container .social-icon').forEach(icon => {
    icon.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
        
        // Reset hamburger animation
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// Close mobile menu when clicking on desktop social icons (for smaller screens)
document.querySelectorAll('.desktop-social-icons .social-icon').forEach(icon => {
    icon.addEventListener('click', () => {
        // Only close menu if it's open (mobile view)
        if (hamburger.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
            
            // Reset hamburger animation
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
        
        // Reset hamburger animation
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(0, 0, 0, 0.95)';
    } else {
        navbar.style.background = 'rgba(0, 0, 0, 0.9)';
    }
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroBackground = document.querySelector('.hero-background');
    
    if (hero && heroBackground) {
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections for fade-in effect
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(section);
});

// Music player functionality
document.querySelectorAll('.play-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const trackCard = this.closest('.track-card');
        const trackTitle = trackCard.querySelector('.track-title').textContent;
        
        // Simulate playing music
        this.textContent = this.textContent === 'Play' ? 'Pause' : 'Play';
        
        // Add visual feedback
        if (this.textContent === 'Pause') {
            trackCard.style.borderColor = '#888';
            trackCard.style.boxShadow = '0 0 20px rgba(136, 136, 136, 0.3)';
        } else {
            trackCard.style.borderColor = '#444';
            trackCard.style.boxShadow = 'none';
        }
        
        console.log(`Playing: ${trackTitle}`);
    });
});

// Download button functionality
document.querySelectorAll('.download-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const trackCard = this.closest('.track-card');
        const trackTitle = trackCard.querySelector('.track-title').textContent;
        
        // Simulate download
        this.textContent = 'Downloading...';
        this.style.background = '#666';
        this.style.color = '#000';
        
        setTimeout(() => {
            this.textContent = 'Downloaded';
            this.style.background = '#444';
            this.style.color = '#e0e0e0';
            
            setTimeout(() => {
                this.textContent = 'Download';
                this.style.background = 'transparent';
            }, 2000);
        }, 1500);
        
        console.log(`Downloading: ${trackTitle}`);
    });
});

// Merch add to cart functionality
document.querySelectorAll('.buy-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const productCard = this.closest('.product-card');
        const productTitle = productCard.querySelector('.product-title').textContent;
        
        // Simulate adding to cart
        this.textContent = 'Added to Cart';
        this.style.background = '#666';
        this.style.color = '#000';
        
        setTimeout(() => {
            this.textContent = 'Add to Cart';
            this.style.background = 'transparent';
            this.style.color = '#e0e0e0';
        }, 2000);
        
        console.log(`Added to cart: ${productTitle}`);
    });
});

// Contact form submission
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        
        // Simulate form submission
        submitBtn.textContent = 'Sending...';
        submitBtn.style.background = '#666';
        submitBtn.style.color = '#000';
        
        setTimeout(() => {
            submitBtn.textContent = 'Message Sent!';
            submitBtn.style.background = '#444';
            
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.background = 'transparent';
                submitBtn.style.color = '#e0e0e0';
                this.reset();
            }, 2000);
        }, 1500);
        
        console.log('Contact form submitted');
    });
}

// Glitch effect enhancement
function enhanceGlitchEffect() {
    const glitchText = document.querySelector('.glitch-text');
    if (glitchText) {
        setInterval(() => {
            glitchText.style.textShadow = `
                ${Math.random() * 10 - 5}px ${Math.random() * 10 - 5}px 0 rgba(255, 0, 0, 0.5),
                ${Math.random() * 10 - 5}px ${Math.random() * 10 - 5}px 0 rgba(0, 255, 255, 0.5)
            `;
        }, 100);
        
        setTimeout(() => {
            glitchText.style.textShadow = '0 0 30px rgba(255, 255, 255, 0.5)';
        }, 200);
    }
}

// Enhanced smoke effect
function enhanceSmokeEffect() {
    const smokeOverlay = document.querySelector('.smoke-overlay');
    if (smokeOverlay) {
        setInterval(() => {
            smokeOverlay.style.opacity = 0.2 + Math.random() * 0.2;
        }, 3000);
    }
}

// Cursor trail effect
function createCursorTrail() {
    const trail = document.createElement('div');
    trail.style.position = 'fixed';
    trail.style.width = '4px';
    trail.style.height = '4px';
    trail.style.background = 'rgba(255, 255, 255, 0.3)';
    trail.style.borderRadius = '50%';
    trail.style.pointerEvents = 'none';
    trail.style.zIndex = '9999';
    trail.style.transition = 'all 0.1s ease';
    document.body.appendChild(trail);
    
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        trail.style.left = mouseX + 'px';
        trail.style.top = mouseY + 'px';
        trail.style.opacity = '1';
        
        setTimeout(() => {
            trail.style.opacity = '0';
        }, 100);
    });
}

// Initialize effects when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Add loading animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 1s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // Initialize effects
    enhanceGlitchEffect();
    enhanceSmokeEffect();
    createCursorTrail();
    
    // Add random glitch moments
    setInterval(() => {
        if (Math.random() < 0.1) {
            enhanceGlitchEffect();
        }
    }, 5000);
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowDown':
        case 'PageDown':
            e.preventDefault();
            window.scrollBy({
                top: window.innerHeight,
                behavior: 'smooth'
            });
            break;
        case 'ArrowUp':
        case 'PageUp':
            e.preventDefault();
            window.scrollBy({
                top: -window.innerHeight,
                behavior: 'smooth'
            });
            break;
        case 'Home':
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            break;
        case 'End':
            e.preventDefault();
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
            break;
    }
});

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(() => {
    // Scroll-based effects here
}, 16)); // 60fps

// Add subtle hover effects to all interactive elements
document.querySelectorAll('a, button, .track-card, .product-card, .gallery-item').forEach(element => {
    element.addEventListener('mouseenter', function() {
        this.style.transform = this.style.transform + ' scale(1.02)';
    });
    
    element.addEventListener('mouseleave', function() {
        this.style.transform = this.style.transform.replace(' scale(1.02)', '');
    });
});

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // Up, Up, Down, Down, Left, Right, Left, Right, B, A

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.keyCode);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        // Activate special mode
        document.body.style.filter = 'hue-rotate(180deg)';
        document.body.style.transition = 'filter 2s ease';
        
        setTimeout(() => {
            document.body.style.filter = 'none';
        }, 5000);
        
        console.log('Konami code activated!');
    }
});

// Form validation for signup form
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signup-form');
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');

    // Validation functions
    function validateFirstName() {
        const value = firstName.value.trim();
        const errorElement = document.getElementById('firstName-error');
        
        if (value.length < 2) {
            showError(firstName, errorElement, 'First name must be at least 2 characters long');
            return false;
        } else {
            showSuccess(firstName, errorElement);
            return true;
        }
    }

    function validateLastName() {
        const value = lastName.value.trim();
        const errorElement = document.getElementById('lastName-error');
        
        if (value.length < 2) {
            showError(lastName, errorElement, 'Last name must be at least 2 characters long');
            return false;
        } else {
            showSuccess(lastName, errorElement);
            return true;
        }
    }

    function validateEmail() {
        const value = email.value.trim();
        const errorElement = document.getElementById('email-error');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(value)) {
            showError(email, errorElement, 'Please enter a valid email address');
            return false;
        } else {
            showSuccess(email, errorElement);
            return true;
        }
    }

    function validatePhone() {
        const value = phone.value.replace(/\D/g, ''); // Remove non-digits
        const errorElement = document.getElementById('phone-error');
        
        if (value.length !== 10) {
            showError(phone, errorElement, 'Phone number must be exactly 10 digits (including area code)');
            return false;
        } else {
            showSuccess(phone, errorElement);
            return true;
        }
    }

    function showError(input, errorElement, message) {
        input.classList.remove('valid');
        input.classList.add('error');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }

    function showSuccess(input, errorElement) {
        input.classList.remove('error');
        input.classList.add('valid');
        errorElement.classList.remove('show');
    }

    // Real-time validation
    firstName.addEventListener('blur', validateFirstName);
    lastName.addEventListener('blur', validateLastName);
    email.addEventListener('blur', validateEmail);
    phone.addEventListener('blur', validatePhone);

    // Phone number formatting (only allow digits)
    phone.addEventListener('input', function(e) {
        // Remove any non-digit characters
        this.value = this.value.replace(/\D/g, '');
        
        // Limit to 10 digits
        if (this.value.length > 10) {
            this.value = this.value.slice(0, 10);
        }
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const isFirstNameValid = validateFirstName();
        const isLastNameValid = validateLastName();
        const isEmailValid = validateEmail();
        const isPhoneValid = validatePhone();
        
        if (isFirstNameValid && isLastNameValid && isEmailValid && isPhoneValid) {
            // All validations passed
            alert('Thank you for signing up! Your information has been submitted successfully.');
            form.reset();
            
            // Clear validation states
            [firstName, lastName, email, phone].forEach(input => {
                input.classList.remove('valid', 'error');
            });
            
            // Hide all error messages
            document.querySelectorAll('.error-message').forEach(error => {
                error.classList.remove('show');
            });
        } else {
            // Show first error message
            if (!isFirstNameValid) firstName.focus();
            else if (!isLastNameValid) lastName.focus();
            else if (!isEmailValid) email.focus();
            else if (!isPhoneValid) phone.focus();
        }
    });
});
