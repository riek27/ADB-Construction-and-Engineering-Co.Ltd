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
const thankYouMessage = document.getElementById('thankYouMessage');

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = getCurrentPage();
    
    if (currentPage === 'gallery') {
        initializeGallery();
        setupGalleryFilter();
    } else if (currentPage === 'home') {
        initializeHomeGallery();
    }
    
    setupEventListeners();
    setActiveNavLink();

    if (currentPage === 'home') {
        initStatsAnimation();
    }
    animateOnScroll();
});

// ===== FUNCTIONS =====
function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('about.html')) return 'about';
    if (path.includes('services.html')) return 'services';
    if (path.includes('gallery.html')) return 'gallery';
    if (path.includes('contact.html')) return 'contact';
    return 'home';
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
    galleryItems = Array.from(galleryGrid.querySelectorAll('.gallery-item'));
    filteredGalleryItems = [...galleryItems];

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
        item.setAttribute('data-index', index);
    });
}

function initializeHomeGallery() {
    const homeGallery = document.getElementById('homeGallery');
    if (!homeGallery) return;

    const homeImages = [
        { url: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', title: 'Modern Construction Project' },
        { url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', title: 'Completed Luxury Home' },
        { url: 'assets/adbcons.jpeg', title: 'Construction work' }
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
        galleryItem.addEventListener('click', () => window.location.href = 'gallery.html');
    });
}

function setupGalleryFilter() {
    if (!categoryButtons.length) return;
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            filterGallery(this.getAttribute('data-category'));
        });
    });
}

function filterGallery(category) {
    if (!galleryGrid) return;
    const galleryItems = galleryGrid.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        if (category === 'all' || item.classList.contains(category)) {
            item.style.display = 'block';
            setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 10);
        } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            setTimeout(() => { item.style.display = 'none'; }, 300);
        }
    });

    filteredGalleryItems = category === 'all'
        ? Array.from(galleryItems)
        : Array.from(galleryItems).filter(item => item.classList.contains(category));
}

function setupEventListeners() {
    // Mobile nav
    if (mobileNavToggle) mobileNavToggle.addEventListener('click', () => { mobileNav.classList.add('active'); document.body.style.overflow = 'hidden'; });
    if (mobileNavClose) mobileNavClose.addEventListener('click', () => { mobileNav.classList.remove('active'); document.body.style.overflow = 'auto'; });

    // Mobile services dropdown
    if (mobileServicesToggle) {
        mobileServicesToggle.addEventListener('click', () => {
            mobileServicesContent.classList.toggle('active');
            const icon = mobileServicesToggle.querySelector('i');
            if (mobileServicesContent.classList.contains('active')) { icon.classList.remove('fa-plus'); icon.classList.add('fa-minus'); }
            else { icon.classList.remove('fa-minus'); icon.classList.add('fa-plus'); }
        });
    }

    // WhatsApp widget
    if (whatsappButton) whatsappButton.addEventListener('click', () => whatsappPopup.classList.toggle('active'));
    if (popupClose) popupClose.addEventListener('click', () => whatsappPopup.classList.remove('active'));
    if (whatsappCancel) whatsappCancel.addEventListener('click', () => whatsappPopup.classList.remove('active'));
    document.addEventListener('click', (e) => {
        if (whatsappPopup && whatsappButton && !whatsappPopup.contains(e.target) && !whatsappButton.contains(e.target)) {
            whatsappPopup.classList.remove('active');
        }
    });

    // Accordion
    if (accordionToggles.length > 0) {
        accordionToggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const accordionItem = toggle.closest('.accordion-item');
                const accordionContent = accordionItem.querySelector('.accordion-content');
                const icon = toggle.querySelector('i');
                accordionContent.classList.toggle('active');
                if (accordionContent.classList.contains('active')) { icon.classList.remove('fa-plus'); icon.classList.add('fa-minus'); }
                else { icon.classList.remove('fa-minus'); icon.classList.add('fa-plus'); }
            });
        });
    }

    // Lightbox
    if (lightboxClose) lightboxClose.addEventListener('click', () => { lightboxModal.classList.remove('active'); document.body.style.overflow = 'auto'; });
    if (lightboxPrev) lightboxPrev.addEventListener('click', () => { if (filteredGalleryItems.length > 0) { currentImageIndex = (currentImageIndex - 1 + filteredGalleryItems.length) % filteredGalleryItems.length; updateLightboxImage(); } });
    if (lightboxNext) lightboxNext.addEventListener('click', () => { if (filteredGalleryItems.length > 0) { currentImageIndex = (currentImageIndex + 1) % filteredGalleryItems.length; updateLightboxImage(); } });

    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => { if (e.target === lightboxModal) { lightboxModal.classList.remove('active'); document.body.style.overflow = 'auto'; } });
        document.addEventListener('keydown', (e) => {
            if (lightboxModal.classList.contains('active')) {
                if (e.key === 'Escape') lightboxClose.click();
                else if (e.key === 'ArrowLeft') lightboxPrev.click();
                else if (e.key === 'ArrowRight') lightboxNext.click();
            }
        });
    }

    // Contact form - only use green popup
    if (contactForm && thankYouMessage) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(contactForm);

            fetch("/", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(formData).toString()
            })
            .then(() => {
                thankYouMessage.style.display = 'block';
                setTimeout(() => { thankYouMessage.style.display = 'none'; }, 5000);
                contactForm.reset();
            })
            .catch(() => alert("Oops! Something went wrong. Please try again."));
        });
    }

    // Sticky header
    const header = document.querySelector('header');
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > 100) { header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)'; header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)'; }
        else { header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)'; header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)'; }
        if (scrollTop > lastScrollTop && scrollTop > 200) header.style.transform = 'translateY(-100%)';
        else header.style.transform = 'translateY(0)';
        lastScrollTop = scrollTop;
    });
}

function openLightbox(index) {
    if (!galleryGrid) return;
    const clickedItem = galleryGrid.querySelector(`.gallery-item[data-index="${index}"]`);
    if (!clickedItem) return;
    const category = getCurrentFilterCategory();
    let galleryItemsArray = category === 'all' ? Array.from(galleryGrid.querySelectorAll('.gallery-item')) : Array.from(galleryGrid.querySelectorAll(`.gallery-item.${category}`));
    currentImageIndex = galleryItemsArray.findIndex(item => item.getAttribute('data-index') === index.toString());
    if (currentImageIndex === -1) { galleryItemsArray = Array.from(galleryGrid.querySelectorAll('.gallery-item')); currentImageIndex = galleryItemsArray.findIndex(item => item.getAttribute('data-index') === index.toString()); }
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
        if (titleElement && lightboxTitle) lightboxTitle.textContent = titleElement.textContent;
        if (lightboxCategory) {
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
                    if (currentValue >= targetValue) { statNumber.textContent = targetValue + '+'; clearInterval(timer); }
                    else statNumber.textContent = Math.floor(currentValue);
                }, 30);
                observer.unobserve(statNumber);
            }
        });
    }, { threshold: 0.5 });
    statNumbers.forEach(stat => observer.observe(stat));
}

// ===== SCROLL ANIMATIONS =====
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.service-card, .value-item, .benefit-item, .process-step, .team-member');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('animated'); });
    }, { threshold: 0.1 });
    elements.forEach(element => observer.observe(element));
};
