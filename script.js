// Smooth slide navigation
let currentPage = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const totalPages = slides.length;

// Initialize
function init() {
    // Set active slide
    updateActiveSlide();
    
    // Add click handlers to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToPage(index);
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            nextPage();
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            prevPage();
        }
    });
    
    // Mouse wheel navigation
    let wheelTimeout;
    document.addEventListener('wheel', (e) => {
        clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
            if (e.deltaY > 0) {
                nextPage();
            } else {
                prevPage();
            }
        }, 100);
    });
    
    // Touch swipe support - improved for mobile
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    let isSwiping = false;
    let swipeCooldown = false;
    
    const slidesContainer = document.querySelector('.slides-container');
    
    slidesContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        isSwiping = false;
    }, { passive: true });
    
    slidesContainer.addEventListener('touchmove', (e) => {
        if (!touchStartX || !touchStartY) return;
        
        touchEndX = e.touches[0].clientX;
        touchEndY = e.touches[0].clientY;
        
        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;
        
        // Determine if this is a horizontal swipe (more horizontal than vertical)
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
            isSwiping = true;
            // Prevent scrolling during horizontal swipe
            e.preventDefault();
        }
    }, { passive: false });
    
    slidesContainer.addEventListener('touchend', (e) => {
        if (!touchStartX || !touchStartY || swipeCooldown) {
            touchStartX = 0;
            touchStartY = 0;
            return;
        }
        
        touchEndX = e.changedTouches[0].clientX;
        touchEndY = e.changedTouches[0].clientY;
        
        handleSwipe();
        
        // Reset
        touchStartX = 0;
        touchStartY = 0;
        touchEndX = 0;
        touchEndY = 0;
        isSwiping = false;
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;
        
        // Only trigger if horizontal swipe is more significant than vertical
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > swipeThreshold) {
            // Prevent rapid swipes
            swipeCooldown = true;
            setTimeout(() => {
                swipeCooldown = false;
            }, 500);
            
            if (diffX > 0) {
                // Swipe left - next page
                nextPage();
            } else {
                // Swipe right - previous page
                prevPage();
            }
        }
    }
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease-out';
            }
        });
    }, observerOptions);
    
    // Observe all cards and elements
    document.querySelectorAll('.vision-card, .feature-card, .membership-card, .benefit-card, .sport-card, .creative-card, .impact-card, .partnership-card').forEach(el => {
        observer.observe(el);
    });
}

function goToPage(page) {
    if (page < 0 || page >= totalPages) return;
    
    const prevSlide = slides[currentPage];
    const nextSlide = slides[page];
    
    // Remove active classes
    prevSlide.classList.remove('active');
    dots[currentPage].classList.remove('active');
    
    // Add appropriate classes for animation
    if (page > currentPage) {
        prevSlide.classList.add('prev');
        nextSlide.style.transform = 'translateX(100%)';
    } else {
        prevSlide.style.transform = 'translateX(-100%)';
        nextSlide.style.transform = 'translateX(-100%)';
    }
    
    // Update current page
    currentPage = page;
    
    // Trigger reflow
    void nextSlide.offsetWidth;
    
    // Add active class
    nextSlide.classList.add('active');
    nextSlide.style.transform = 'translateX(0)';
    dots[currentPage].classList.add('active');
    
    // Clean up after animation
    setTimeout(() => {
        prevSlide.classList.remove('prev');
        prevSlide.style.transform = '';
        nextSlide.style.transform = '';
    }, 800);
}

function nextPage() {
    if (currentPage < totalPages - 1) {
        goToPage(currentPage + 1);
    }
}

function prevPage() {
    if (currentPage > 0) {
        goToPage(currentPage - 1);
    }
}

function updateActiveSlide() {
    slides.forEach((slide, index) => {
        if (index === currentPage) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });
    
    dots.forEach((dot, index) => {
        if (index === currentPage) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Parallax effect on scroll within slides
document.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * 0.5;
    
    // Apply subtle parallax to background elements
    document.body.style.backgroundPosition = `center ${rate}px`;
});

// Add smooth entrance animations
function animateOnLoad() {
    const elements = document.querySelectorAll('.vision-card, .feature-card, .membership-card, .benefit-card, .sport-card, .creative-card, .impact-card, .partnership-card');
    
    elements.forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease-out';
            
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 50);
        }, index * 100);
    });
}

// Initialize on load
window.addEventListener('load', () => {
    init();
    animateOnLoad();
});

// Add hover effects with smooth transitions
document.querySelectorAll('.vision-card, .feature-card, .membership-card, .benefit-card, .sport-card, .creative-card, .impact-card, .partnership-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    });
});

// Smooth page transitions
function smoothTransition(from, to) {
    const fromSlide = slides[from];
    const toSlide = slides[to];
    
    fromSlide.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    toSlide.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
}

