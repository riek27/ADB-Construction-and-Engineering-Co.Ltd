// Product Data
const products = {
    1: {
        title: "Luxury Sofas",
        description: "Our luxury sofas are handcrafted by skilled artisans using traditional Turkish techniques. Each piece features premium materials, including solid wood frames, high-density foam, and the finest upholstery fabrics.",
        features: [
            "Hand-carved wooden frames",
            "Premium fabric or leather upholstery",
            "High-density foam for optimal comfort",
            "Reinforced joints for durability",
            "Custom sizing available"
        ]
    },
    2: {
        title: "Dining Tables",
        description: "Make every meal an occasion with our exquisite dining tables. Crafted from premium woods with intricate detailing, these tables become the centerpiece of your dining experience.",
        features: [
            "Solid wood construction",
            "Hand-finished surfaces",
            "Intricate carved details",
            "Sturdy and stable design",
            "Various sizes and shapes available"
        ]
    },
    3: {
        title: "Bedroom Sets",
        description: "Transform your bedroom into a personal sanctuary with our luxurious bedroom collections. From elegant beds to functional storage solutions, create the bedroom of your dreams.",
        features: [
            "Solid wood bed frames",
            "Spacious wardrobes and dressers",
            "Soft-close drawer mechanisms",
            "Elegant hardware finishes",
            "Custom configurations available"
        ]
    },
    4: {
        title: "Office Desks",
        description: "Enhance your workspace with our executive office desks that combine functionality with sophisticated design. Perfect for home offices or corporate environments.",
        features: [
            "Spacious work surface",
            "Integrated cable management",
            "Sturdy construction",
            "Elegant finish options",
            "Optional storage additions"
        ]
    },
    5: {
        title: "Wardrobes",
        description: "Our custom-designed wardrobes optimize space while adding an element of luxury to your bedroom. Tailored to your specific storage needs and aesthetic preferences.",
        features: [
            "Custom sizing and configuration",
            "Premium wood construction",
            "Soft-close doors and drawers",
            "Interior lighting options",
            "Various finish and hardware options"
        ]
    },
    6: {
        title: "Interior Decor",
        description: "Complete your interior design with our selection of complementary decor pieces. From accent tables to decorative items, add the perfect finishing touches to your space.",
        features: [
            "Handcrafted decorative items",
            "Premium materials and finishes",
            "Various style options",
            "Complements main furniture pieces",
            "Unique statement pieces"
        ]
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Common functionality for all pages
    
    // Sticky Header
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Fade-in on Scroll
    const fadeElements = document.querySelectorAll('.fade-in');
    const fadeInOnScroll = () => {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    };

    window.addEventListener('scroll', fadeInOnScroll);
    // Initial check
    fadeInOnScroll();

    // Parallax Effect for Section Backgrounds
    const sectionBgs = document.querySelectorAll('.section-bg');
    if (sectionBgs.length > 0) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            sectionBgs.forEach(bg => {
                const rate = scrolled * -0.5;
                bg.style.transform = `translate3d(0px, ${rate}px, 0px)`;
            });
        });
    }

    // Page-specific functionality
    
    // Homepage Slideshow
    if (document.querySelector('.slideshow')) {
        const slides = document.querySelectorAll('.slide');
        let currentSlide = 0;
        const slideInterval = 5000; // 5 seconds

        function nextSlide() {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }

        // Start slideshow
        let slideTimer = setInterval(nextSlide, slideInterval);

        // Pause slideshow on hover
        const slideshow = document.querySelector('.slideshow');
        slideshow.addEventListener('mouseenter', () => {
            clearInterval(slideTimer);
        });

        slideshow.addEventListener('mouseleave', () => {
            slideTimer = setInterval(nextSlide, slideInterval);
        });
    }

    // Product Modal
    const viewProductButtons = document.querySelectorAll('.view-product');
    const productModal = document.getElementById('productModal');
    const modalClose = document.querySelector('.modal-close');
    
    if (viewProductButtons.length > 0 && productModal) {
        viewProductButtons.forEach(button => {
            button.addEventListener('click', () => {
                const productId = button.closest('.product-card').getAttribute('data-product');
                const product = products[productId];
                
                if (product) {
                    // Set modal content
                    document.getElementById('modalTitle').textContent = product.title;
                    document.getElementById('modalDescription').textContent = product.description;
                    
                    const featuresList = document.getElementById('modalFeatures');
                    featuresList.innerHTML = '';
                    
                    product.features.forEach(feature => {
                        const li = document.createElement('li');
                        li.textContent = feature;
                        featuresList.appendChild(li);
                    });
                    
                    productModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        // Close Modal
        modalClose.addEventListener('click', () => {
            productModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });

        // Close modal when clicking outside
        productModal.addEventListener('click', (e) => {
            if (e.target === productModal) {
                productModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Gallery Lightbox
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    
    if (galleryItems.length > 0 && lightbox) {
        const galleryImages = [];
        galleryItems.forEach(item => {
            const img = item.querySelector('img');
            if (img) {
                galleryImages.push(img.src);
            }
        });

        let currentImageIndex = 0;

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                currentImageIndex = index;
                lightboxImage.src = galleryImages[currentImageIndex];
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        // Lightbox Navigation
        if (lightboxPrev && lightboxNext) {
            lightboxPrev.addEventListener('click', () => {
                currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
                lightboxImage.src = galleryImages[currentImageIndex];
            });

            lightboxNext.addEventListener('click', () => {
                currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
                lightboxImage.src = galleryImages[currentImageIndex];
            });
        }

        // Close Lightbox
        lightboxClose.addEventListener('click', () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        });

        // Close lightbox when clicking outside
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Read More/Less Toggle
    const readMoreButtons = document.querySelectorAll('.read-more');
    if (readMoreButtons.length > 0) {
        readMoreButtons.forEach(button => {
            button.addEventListener('click', () => {
                const postFull = button.previousElementSibling;
                const isExpanded = postFull.classList.contains('expanded');
                
                if (isExpanded) {
                    postFull.classList.remove('expanded');
                    button.textContent = 'Read More';
                } else {
                    postFull.classList.add('expanded');
                    button.textContent = 'Read Less';
                }
            });
        });
    }

    // Animated Counters
    const counters = document.querySelectorAll('.counter-number');
    if (counters.length > 0) {
        const animateCounters = () => {
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                const duration = 2000; // 2 seconds
                const step = target / (duration / 16); // 60fps
                let current = 0;
                
                const updateCounter = () => {
                    current += step;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                updateCounter();
            });
        };

        // Start counters when section is in view
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            const aboutObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounters();
                        aboutObserver.unobserve(aboutSection);
                    }
                });
            }, { threshold: 0.5 });

            aboutObserver.observe(aboutSection);
        }
    }

    // Form Validation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const message = document.getElementById('message').value;
            
            // Simple validation
            if (name && email && phone && message) {
                alert('Thank you for your message! We will get back to you soon.');
                contactForm.reset();
            } else {
                alert('Please fill in all fields.');
            }
        });
    }
});
