// ===== GLOBAL VARIABLES =====
let currentImageIndex = 0;
let galleryItems = [];
let filteredGalleryItems = [];

// ===== DOM ELEMENTS =====
const mobileNavToggle = document.getElementById('mobileNavToggle');
const mobileNav = document.getElementById('mobileNav');
const mobileNavClose = document.getElementById('mobileNavClose');
const mobileServicesToggle = document.getElementById('mobileServicesToggle');
const mobileServicesContent = document.getElementById('mobileServicesContent');
const whatsappButton = document.getElementById('whatsappButton');
const whatsappPopup = document.getElementById('whatsappPopup');
const popupClose = document.getElementById('popupClose');
const whatsappCancel = document.getElementById('whatsappCancel');
const accordionToggles = document.querySelectorAll('.accordion-toggle');
const lightboxModal = document.getElementById('lightboxModal');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxCategory = document.getElementById('lightboxCategory');
const galleryGrid = document.getElementById('galleryGrid');
const contactForm = document.getElementById('contactForm');
const categoryButtons = document.querySelectorAll('.category-btn');

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize based on current page
    const currentPage = getCurrentPage();
    
    if (currentPage === 'gallery') {
        initializeGallery();
        setupGalleryFilter();
    } else if (currentPage === 'home') {
        initializeHomeGallery();
    }
    
    setupEventListeners();
    
    // Set active navigation link
    setActiveNavLink();
    
    // Initialize stats animation on home page
    if (currentPage === 'home') {
        initStatsAnimation();
    }
});

// ===== FUNCTIONS =====
function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('about.html')) return 'about';
    if (path.includes('services.html')) return 'services';
    if (path.includes('gallery.html')) return 'gallery';
    if (path.includes('contact.html')) return 'contact';
    return 'home'; // Default to home
}

function setActiveNavLink() {
    const currentPage = getCurrentPage();
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav-links a');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkPage = link.getAttribute('href');
        
        if ((currentPage === 'home' && (linkPage === 'index.html' || linkPage === './')) ||
            (currentPage !== 'home' && linkPage.includes(currentPage + '.html'))) {
            link.classList.add('active');
        }
    });
}

function initializeGallery() {
    if (!galleryGrid) return;
    
    // Get all gallery items from the DOM
    galleryItems = Array.from(galleryGrid.querySelectorAll('.gallery-item'));
    filteredGalleryItems = [...galleryItems];
    
    // Set up click events for each gallery item
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
        
        // Ensure each item has the correct data-index
        item.setAttribute('data-index', index);
    });
}

function initializeHomeGallery() {
    const homeGallery = document.getElementById('homeGallery');
    if (!homeGallery) return;
    
    // Add 3 sample images to home gallery
    const homeImages = [
        {
            url: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80 ',
            title: 'Modern Construction Project'
        },
        {
            url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80  ',
            title: 'Completed Luxury Home'
        },
        {
            url: 'assets/adbcons.jpeg',
            title: 'Construction work'
        }
    ];
    
    homeGallery.innerHTML = '';
    
    homeImages.forEach((image, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-preview-item';
        galleryItem.innerHTML = `
            <img src="${image.url}" alt="${image.title}">
            <div class="gallery-overlay">
                <h4>${image.title}</h4>
            </div>
        `;
        homeGallery.appendChild(galleryItem);
        
        // Add click event to redirect to gallery page
        galleryItem.addEventListener('click', () => {
            window.location.href = 'gallery.html';
        });
    });
}

function setupGalleryFilter() {
    if (!categoryButtons.length) return;
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            filterGallery(category);
        });
    });
}

function filterGallery(category) {
    if (!galleryGrid) return;
    
    const galleryItems = galleryGrid.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        if (category === 'all' || item.classList.contains(category)) {
            item.style.display = 'block';
            // Add fade in animation
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
            }, 10);
        } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
    });
    
    // Update filtered items array
    if (category === 'all') {
        filteredGalleryItems = Array.from(galleryItems);
    } else {
        filteredGalleryItems = Array.from(galleryItems).filter(item => 
            item.classList.contains(category)
        );
    }
}

function setupEventListeners() {
    // Mobile navigation toggle
    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', () => {
            mobileNav.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (mobileNavClose) {
        mobileNavClose.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }
    
    // Mobile services dropdown toggle
    if (mobileServicesToggle) {
        mobileServicesToggle.addEventListener('click', () => {
            mobileServicesContent.classList.toggle('active');
            const icon = mobileServicesToggle.querySelector('i');
            if (mobileServicesContent.classList.contains('active')) {
                icon.classList.remove('fa-plus');
                icon.classList.add('fa-minus');
            } else {
                icon.classList.remove('fa-minus');
                icon.classList.add('fa-plus');
            }
        });
    }
    
    // WhatsApp widget
    if (whatsappButton) {
        whatsappButton.addEventListener('click', () => {
            whatsappPopup.classList.toggle('active');
        });
    }
    
    if (popupClose) {
        popupClose.addEventListener('click', () => {
            whatsappPopup.classList.remove('active');
        });
    }
    
    if (whatsappCancel) {
        whatsappCancel.addEventListener('click', () => {
            whatsappPopup.classList.remove('active');
        });
    }
    
    // Close WhatsApp popup when clicking outside
    document.addEventListener('click', (e) => {
        if (whatsappPopup && whatsappButton && !whatsappPopup.contains(e.target) && !whatsappButton.contains(e.target)) {
            whatsappPopup.classList.remove('active');
        }
    });
    
    // Services accordion
    if (accordionToggles.length > 0) {
        accordionToggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const accordionItem = toggle.closest('.accordion-item');
                const accordionContent = accordionItem.querySelector('.accordion-content');
                const icon = toggle.querySelector('i');
                
                // Toggle active class
                accordionContent.classList.toggle('active');
                
                // Change icon
                if (accordionContent.classList.contains('active')) {
                    icon.classList.remove('fa-plus');
                    icon.classList.add('fa-minus');
                } else {
                    icon.classList.remove('fa-minus');
                    icon.classList.add('fa-plus');
                }
            });
        });
    }
    
    // Lightbox functionality
    if (lightboxClose) {
        lightboxClose.addEventListener('click', () => {
            lightboxModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }
    
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', () => {
            if (filteredGalleryItems.length > 0) {
                currentImageIndex = (currentImageIndex - 1 + filteredGalleryItems.length) % filteredGalleryItems.length;
                updateLightboxImage();
            }
        });
    }
    
    if (lightboxNext) {
        lightboxNext.addEventListener('click', () => {
            if (filteredGalleryItems.length > 0) {
                currentImageIndex = (currentImageIndex + 1) % filteredGalleryItems.length;
                updateLightboxImage();
            }
        });
    }
    
    // Close lightbox when clicking outside the image
    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                lightboxModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
        
        // Close lightbox with ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
                lightboxModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
            
            // Navigate lightbox with arrow keys
            if (lightboxModal.classList.contains('active')) {
                if (e.key === 'ArrowLeft') {
                    lightboxPrev.click();
                } else if (e.key === 'ArrowRight') {
                    lightboxNext.click();
                }
            }
        });
    }
    
    // Contact form submission
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const message = document.getElementById('message').value;
            
            // Form validation
            if (!name || !email || !message) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // In a real application, you would send this data to a server
            // For now, we'll show a success message
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                alert(`Thank you, ${name}! Your message has been sent. We will contact you at ${email} or ${phone} shortly.`);
                
                // Reset the form
                contactForm.reset();
                
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }
    
    // Sticky header scroll effect
    const header = document.querySelector('header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        }
        
        // Hide/show header on scroll
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

function openLightbox(index) {
    if (!galleryGrid) return;
    
    // Get the clicked item
    const clickedItem = galleryGrid.querySelector(`.gallery-item[data-index="${index}"]`);
    
    if (!clickedItem) return;
    
    // Find the index of this item in the filtered array
    const category = getCurrentFilterCategory();
    let galleryItemsArray;
    
    if (category === 'all') {
        galleryItemsArray = Array.from(galleryGrid.querySelectorAll('.gallery-item'));
    } else {
        galleryItemsArray = Array.from(galleryGrid.querySelectorAll(`.gallery-item.${category}`));
    }
    
    currentImageIndex = galleryItemsArray.findIndex(item => 
        item.getAttribute('data-index') === index.toString()
    );
    
    // If item not found in filtered array (shouldn't happen), use all items
    if (currentImageIndex === -1) {
        galleryItemsArray = Array.from(galleryGrid.querySelectorAll('.gallery-item'));
        currentImageIndex = galleryItemsArray.findIndex(item => 
            item.getAttribute('data-index') === index.toString()
        );
    }
    
    filteredGalleryItems = galleryItemsArray;
    
    updateLightboxImage();
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function updateLightboxImage() {
    if (!filteredGalleryItems || filteredGalleryItems.length === 0) return;
    
    const currentItem = filteredGalleryItems[currentImageIndex];
    const imgElement = currentItem.querySelector('img');
    const titleElement = currentItem.querySelector('.gallery-overlay h4');
    
    if (imgElement) {
        lightboxImage.src = imgElement.src;
        lightboxImage.alt = imgElement.alt;
        
        if (titleElement && lightboxTitle) {
            lightboxTitle.textContent = titleElement.textContent;
        }
        
        if (lightboxCategory) {
            // Determine category from class list
            const categories = ['construction', 'design', 'completed', 'materials', 'team'];
            const itemCategory = categories.find(cat => currentItem.classList.contains(cat));
            lightboxCategory.textContent = itemCategory ? `Category: ${itemCategory.charAt(0).toUpperCase() + itemCategory.slice(1)}` : '';
        }
    }
}

function getCurrentFilterCategory() {
    const activeButton = document.querySelector('.category-btn.active');
    return activeButton ? activeButton.getAttribute('data-category') : 'all';
}

function initStatsAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (!statNumbers.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target;
                const targetValue = parseInt(statNumber.textContent);
                let currentValue = 0;
                const increment = targetValue / 50;
                const timer = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= targetValue) {
                        statNumber.textContent = targetValue + '+';
                        clearInterval(timer);
                    } else {
                        statNumber.textContent = Math.floor(currentValue);
                    }
                }, 30);
                
                // Stop observing after animation
                observer.unobserve(statNumber);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
}

// ===== SCROLL ANIMATIONS =====
// Animate elements on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.service-card, .value-item, .benefit-item, .process-step, .team-member');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(element => {
        observer.observe(element);
    });
};

// Initialize scroll animations when page loads
window.addEventListener('load', () => {
    animateOnScroll();
});


const form = document.getElementById("contactForm");
const thankYouMessage = document.getElementById("thankYouMessage");

form.addEventListener("submit", function(e) {
  e.preventDefault(); // Prevent page reload

  const formData = new FormData(form);

  fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(formData).toString()
  })
  .then(() => {
    // Show success popup
    thankYouMessage.style.display = "block";

    // Hide after 5 seconds
    setTimeout(() => {
      thankYouMessage.style.display = "none";
    }, 5000);

    // Reset the form
    form.reset();
  })
  .catch((error) => {
    alert("Oops! Something went wrong. Please try again.");
  });
});
