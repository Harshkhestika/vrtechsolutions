// Global variables
let currentSlideIndex = {};
let autoSlideIntervals = {};
let isUserInteracting = {};

// Initialize the website
document.addEventListener('DOMContentLoaded', function () {
    initializeSliders();
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    initializeForms();
    initializeChat();
    initializeLocationFeatures();
});

// Navigation functionality
function initializeNavigation() {
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const closeMobileMenu = document.getElementById('closeMobileMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    const header = document.getElementById('header');

    // Mobile menu toggle
    mobileMenuButton?.addEventListener('click', () => {
        mobileMenu.classList.add('open');
        document.body.style.overflow = 'hidden';
    });

    closeMobileMenu?.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = 'auto';
    });

    // Close mobile menu when clicking on links
    const mobileMenuLinks = mobileMenu?.querySelectorAll('a');
    mobileMenuLinks?.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            document.body.style.overflow = 'auto';
        });
    });

    // Sticky header effect
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 100) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize all sliders
function initializeSliders() {
    const sliders = [
        'distributorTrack',
        'castolinTrack',
        'nbcTrack',
        'starblazeTrack',
        'xtrapowerTrack',
        'velvexTrack'
    ];

    sliders.forEach(sliderId => {
        const track = document.getElementById(sliderId);
        if (track) {
            currentSlideIndex[sliderId] = 0;
            isUserInteracting[sliderId] = false;

            // Clone slides for infinite scrolling effect
            cloneSlidesForInfiniteScroll(sliderId);

            // Start auto-slide
            startAutoSlide(sliderId);

            // Pause on hover
            const sliderContainer = track.closest('.product-slider, .distributor-slider');
            if (sliderContainer) {
                sliderContainer.addEventListener('mouseenter', () => {
                    pauseAutoSlide(sliderId);
                });

                sliderContainer.addEventListener('mouseleave', () => {
                    if (!isUserInteracting[sliderId]) {
                        startAutoSlide(sliderId);
                    }
                });
            }
        }
    });
}

// Clone slides for infinite scrolling
function cloneSlidesForInfiniteScroll(trackId) {
    const track = document.getElementById(trackId);
    if (!track) return;

    const slides = Array.from(track.children);

    // Clone first few slides and append to end
    slides.slice(0, 3).forEach(slide => {
        const clone = slide.cloneNode(true);
        clone.classList.add('cloned');
        track.appendChild(clone);
    });

    // Clone last few slides and prepend to beginning
    slides.slice(-3).forEach(slide => {
        const clone = slide.cloneNode(true);
        clone.classList.add('cloned');
        track.insertBefore(clone, track.firstChild);
    });
}

// Start auto-slide functionality
function startAutoSlide(trackId) {
    const track = document.getElementById(trackId);
    if (!track || autoSlideIntervals[trackId]) return;

    const slides = track.querySelectorAll('.product-card, .distributor-card');
    const slideWidth = slides[0]?.offsetWidth + 32; // 32px for gap

    if (!slideWidth) return;

    autoSlideIntervals[trackId] = setInterval(() => {
        if (!isUserInteracting[trackId]) {
            currentSlideIndex[trackId]++;

            const translateX = -(currentSlideIndex[trackId] * slideWidth);
            track.style.transform = `translateX(${translateX}px)`;
            track.style.transition = 'transform 0.5s ease';

            // Reset position for infinite scrolling
            if (currentSlideIndex[trackId] >= slides.length - 3) {
                setTimeout(() => {
                    track.style.transition = 'none';
                    currentSlideIndex[trackId] = 3;
                    track.style.transform = `translateX(${-(currentSlideIndex[trackId] * slideWidth)}px)`;
                }, 500);
            }
        }
    }, 3000);
}

// Pause auto-slide
function pauseAutoSlide(trackId) {
    if (autoSlideIntervals[trackId]) {
        clearInterval(autoSlideIntervals[trackId]);
        autoSlideIntervals[trackId] = null;
    }
}

// Manual slide control
function slideProducts(trackId, direction) {
    const track = document.getElementById(trackId);
    if (!track) return;

    isUserInteracting[trackId] = true;
    pauseAutoSlide(trackId);

    const slides = track.querySelectorAll('.product-card, .distributor-card');
    const slideWidth = slides[0]?.offsetWidth + 32;

    if (!slideWidth) return;

    currentSlideIndex[trackId] += direction;

    // Boundary checks
    if (currentSlideIndex[trackId] < 0) {
        currentSlideIndex[trackId] = slides.length - 4;
    } else if (currentSlideIndex[trackId] >= slides.length - 3) {
        currentSlideIndex[trackId] = 0;
    }

    const translateX = -(currentSlideIndex[trackId] * slideWidth);
    track.style.transform = `translateX(${translateX}px)`;
    track.style.transition = 'transform 0.5s ease';

    // Resume auto-slide after user interaction
    setTimeout(() => {
        isUserInteracting[trackId] = false;
        startAutoSlide(trackId);
    }, 5000);
}

// Scroll effects
function initializeScrollEffects() {
    const backToTopButton = document.getElementById('backToTop');

    // Back to top functionality
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton?.classList.add('visible');
        } else {
            backToTopButton?.classList.remove('visible');
        }
    });

    backToTopButton?.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Animation on scroll
function initializeAnimations() {
    const animatedElements = document.querySelectorAll('.slide-up, .fade-in');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';

                if (entry.target.classList.contains('slide-up')) {
                    entry.target.style.transform = 'translateY(0)';
                }

                // Add staggered animation for multiple elements
                const delay = Array.from(entry.target.parentElement.children).indexOf(entry.target) * 100;
                entry.target.style.animationDelay = `${delay}ms`;

                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });

    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-height');

        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Form functionality
// Initialize EmailJS
(function () {
    emailjs.init("dOeWicdDqp5Bdpzwa"); // Your Public Key
})();

function initializeForms() {
    // Initialize EmailJS with your Public Key
    emailjs.init({
        publicKey: "dOeWicdDqp5Bdpzwa",
    });

    const contactForm = document.getElementById('contactForm');
    const statusMessage = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;

            // Update button state to show loading
            submitButton.disabled = true;
            submitButton.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i>Sending...`;
            statusMessage.textContent = '';
            statusMessage.style.color = '';

            // Use your EmailJS Service ID and Template ID
            const serviceID = 'service_spdawa8';
            const templateID = 'template_5cjkkyd';

            // Use sendForm to automatically collect form data
            emailjs.sendForm(serviceID, templateID, this)
                .then(() => {
                    // Success callback
                    statusMessage.textContent = 'Message sent successfully!';
                    statusMessage.style.color = 'green';
                    contactForm.reset();
                }, (err) => {
                    // Error callback
                    statusMessage.textContent = 'Failed to send message. Please try again later.';
                    statusMessage.style.color = 'red';
                    console.error('EmailJS Error:', JSON.stringify(err));
                })
                .finally(() => {
                    // Restore button state regardless of success or failure
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalButtonText;
                });
        });
    }
}

// Validation (same as your code)
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = "";

    field.classList.remove("border-red-500");

    if (field.hasAttribute("required") && !value) {
        isValid = false;
        errorMessage = "This field is required";
    } else if (field.type === "email" && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = "Please enter a valid email address";
        }
    } else if (field.type === "tel" && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = "Please enter a valid phone number";
        }
    }

    if (!isValid) {
        field.classList.add("border-red-500");
        showFieldError(field, errorMessage);
    }

    return isValid;
}

function clearFieldError(e) {
    const field = e.target;
    field.classList.remove("border-red-500");

    const errorElement = field.parentElement.querySelector(".field-error");
    if (errorElement) {
        errorElement.remove();
    }
}

function showFieldError(field, message) {
    clearFieldError({ target: field });

    const errorElement = document.createElement("div");
    errorElement.className = "field-error text-red-500 text-sm mt-1";
    errorElement.textContent = message;

    field.parentElement.appendChild(errorElement);
}


// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300`;

    const bgColor = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
        warning: 'bg-yellow-500'
    };

    notification.classList.add(bgColor[type] || bgColor.info);
    notification.classList.add('text-white');

    const icon = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle',
        warning: 'fas fa-exclamation-triangle'
    };

    notification.innerHTML = `
        <div class="flex items-center">
            <i class="${icon[type] || icon.info} mr-3"></i>
            <span>${message}</span>
            <button class="ml-4 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Chat functionality
function initializeChat() {
    const chatButton = document.getElementById('chatButton');
    const chatContainer = document.getElementById('chatContainer');
    const closeChat = document.getElementById('closeChat');

    chatButton?.addEventListener('click', () => {
        chatContainer?.classList.toggle('open');

        // Add typing indicator animation
        if (chatContainer?.classList.contains('open')) {
            setTimeout(() => {
                addTypingIndicator();
            }, 1000);
        }
    });

    closeChat?.addEventListener('click', () => {
        chatContainer?.classList.remove('open');
    });

    // Chat input functionality
    const chatInput = chatContainer?.querySelector('input[type="text"]');
    const chatSendButton = chatContainer?.querySelector('button');

    function sendMessage() {
        const message = chatInput?.value.trim();
        if (message) {
            addMessageToChat(message, 'user');
            chatInput.value = '';

            // Simulate bot response
            setTimeout(() => {
                addTypingIndicator();
                setTimeout(() => {
                    removeTypingIndicator();
                    addMessageToChat(getBotResponse(message), 'bot');
                }, 2000);
            }, 500);
        }
    }

    chatSendButton?.addEventListener('click', sendMessage);

    chatInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

function addMessageToChat(message, sender) {
    const chatContent = document.querySelector('.chat-container .bg-gray-50');
    if (!chatContent) return;

    const messageElement = document.createElement('div');
    messageElement.className = sender === 'user'
        ? 'bg-blue-100 p-3 rounded-lg ml-6 mb-3 animate-slide-in-right'
        : 'bg-white p-3 rounded-lg shadow-sm mb-3 animate-slide-in-left';

    messageElement.innerHTML = `<p class="text-sm">${message}</p>`;

    chatContent.appendChild(messageElement);
    chatContent.scrollTop = chatContent.scrollHeight;
}

function addTypingIndicator() {
    const chatContent = document.querySelector('.chat-container .bg-gray-50');
    if (!chatContent) return;

    const typingElement = document.createElement('div');
    typingElement.className = 'typing-indicator bg-white p-3 rounded-lg shadow-sm mb-3';
    typingElement.innerHTML = `
        <div class="flex items-center">
            <div class="typing-dots flex space-x-1">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
        </div>
    `;

    chatContent.appendChild(typingElement);
    chatContent.scrollTop = chatContent.scrollHeight;

    // Add CSS for typing animation if not already added
    if (!document.querySelector('.typing-animation-styles')) {
        const style = document.createElement('style');
        style.className = 'typing-animation-styles';
        style.textContent = `
            .typing-dots .dot {
                width: 8px;
                height: 8px;
                background: #666;
                border-radius: 50%;
                animation: typing 1.4s infinite ease-in-out;
            }
            .typing-dots .dot:nth-child(1) { animation-delay: -0.32s; }
            .typing-dots .dot:nth-child(2) { animation-delay: -0.16s; }
            @keyframes typing {
                0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
                40% { transform: scale(1); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
}

function removeTypingIndicator() {
    const typingIndicator = document.querySelector('.typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function getBotResponse(userMessage) {
    const responses = {
        'hello': 'Hello! How can I help you with our industrial tools and equipment?',
        'hi': 'Hi there! What can I assist you with today?',
        'price': 'For pricing information, please contact us at +91-8878881555 or email vrtechsolutions25@gmail.com',
        'product': 'We offer a wide range of industrial tools including power tools, welding equipment, abrasives, and more. What specific product are you interested in?',
        'contact': 'You can reach us at +91-8878881555 or email vrtechsolutions25@gmail.com. Our office is located in Jaipur and Udaipur.',
        'default': 'Thank you for your inquiry. For detailed information, please contact our sales team at +91-8878881555.'
    };

    const lowerMessage = userMessage.toLowerCase();

    for (const [key, response] of Object.entries(responses)) {
        if (key !== 'default' && lowerMessage.includes(key)) {
            return response;
        }
    }

    return responses.default;
}

// Location features
function initializeLocationFeatures() {
    const getDirectionsBtn = document.getElementById('getDirectionsBtn');
    const mapModal = document.getElementById('mapModal');
    const closeMapModal = document.getElementById('closeMapModal');

    getDirectionsBtn?.addEventListener('click', () => {
        mapModal?.classList.remove('hidden');
        updateMapLinks();
    });

    closeMapModal?.addEventListener('click', () => {
        mapModal?.classList.add('hidden');
    });

    // Close modal when clicking outside
    mapModal?.addEventListener('click', (e) => {
        if (e.target === mapModal) {
            mapModal.classList.add('hidden');
        }
    });
}

function updateMapLinks() {
    const address = "Behind Rajkamal hotel, Bhawana, Udaipur, Rajasthan, India";
    const encodedAddress = encodeURIComponent(address);

    const googleMapsLink = document.getElementById('googleMapsLink');
    const appleMapsLink = document.getElementById('appleMapsLink');

    if (googleMapsLink) {
        googleMapsLink.href = `https://maps.google.com/maps?q=${encodedAddress}`;
    }

    if (appleMapsLink) {
        appleMapsLink.href = `maps://maps.google.com/maps?q=${encodedAddress}`;
    }
}

// Product filtering functionality
function initializeProductFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            button.classList.add('active');

            // Get filter value
            const filterValue = button.getAttribute('data-filter');

            // Filter products with animation
            productCards.forEach((card, index) => {
                setTimeout(() => {
                    if (filterValue === 'all') {
                        card.style.display = 'flex';
                        card.classList.add('animate-fade-in');
                    } else {
                        if (card.getAttribute('data-category') === filterValue) {
                            card.style.display = 'flex';
                            card.classList.add('animate-fade-in');
                        } else {
                            card.style.display = 'none';
                            card.classList.remove('animate-fade-in');
                        }
                    }
                }, index * 100);
            });
        });
    });
}


// Search functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search-input');

    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
        const description = card.querySelector('p')?.textContent.toLowerCase() || '';

        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = 'flex';
            highlightSearchTerm(card, searchTerm);
        } else {
            card.style.display = 'none';
        }
    });
}

function highlightSearchTerm(card, term) {
    if (!term) return;

    const title = card.querySelector('h3');
    const description = card.querySelector('p');

    [title, description].forEach(element => {
        if (element) {
            const text = element.textContent;
            const highlightedText = text.replace(
                new RegExp(term, 'gi'),
                `<mark class="bg-yellow-200">$&</mark>`
            );
            element.innerHTML = highlightedText;
        }
    });
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Lazy loading for images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Performance optimization
function optimizePerformance() {
    // Preload critical resources
    const criticalImages = [
        'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    ];

    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Initialize performance optimizations
optimizePerformance();

// Add CSS animations dynamically
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .animate-fade-in {
            animation: fadeIn 0.5s ease-in-out;
        }
        
        .animate-slide-in-left {
            animation: slideInLeft 0.3s ease-out;
        }
        
        .animate-slide-in-right {
            animation: slideInRight 0.3s ease-out;
        }
        
        @keyframes slideInLeft {
            from { transform: translateX(-100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

// Add dynamic styles on load
addDynamicStyles();

// Global error handling
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    // Could send error reports to analytics service
});

// Service Worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}


// Hero Slider Functionality
document.addEventListener('DOMContentLoaded', function () {
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    function showSlide(n) {
        slides.forEach(slide => slide.classList.remove('active'));
        currentSlide = (n + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    // Auto-advance slides every 2 seconds
    setInterval(() => {
        showSlide(currentSlide + 1);
    }, 2000);
});

