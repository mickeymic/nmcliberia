// Global variables
let currentSlide = 0;
let slides = [];
let autoSlideInterval;
let contentData = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadContent();
    updateDateTime();
    setInterval(updateDateTime, 1000); // Update every second
    initializeSearch();
    initializeBackToTop();
    initializePublications();
    initializeNewsActions();
    reportNmcFirebaseConfigStatus();
    initializeRsvpModal();
    initializeCommunityRegisterModal();
    initializeMembershipSystem();
});

// Load content from JSON file
async function loadContent() {
    try {
        const response = await fetch('content.json');
        contentData = await response.json();
        
        // Update page title
        document.title = contentData.topHeader?.welcomeText || "National Muslim Council of Liberia";
        
        // Populate all sections
        populateTopHeader();
        populateNavigation();
        populateNewsTicker();
        populateLatestNews();
        populateHeroSlider();
        populateAboutSection();
        populateFooter();
        
        // Initialize slider
        initializeSlider();
        
    } catch (error) {
        console.error('Error loading content:', error);
    }
}

// Populate top header
function populateTopHeader() {
    const welcomeElement = document.getElementById('welcomeMessage');
    if (welcomeElement && contentData.topHeader?.welcomeText) {
        welcomeElement.textContent = contentData.topHeader.welcomeText;
    }
}

// Populate navigation
function populateNavigation() {
    const navElement = document.getElementById('navigation');
    if (navElement && contentData.mainHeader?.navigation) {
        navElement.innerHTML = contentData.mainHeader.navigation.map(item => 
            `<li><a href="${item.link}">${item.label}</a></li>`
        ).join('');
    }
}

function populateWelcomeMessage() {
    const welcomeElement = document.getElementById('welcomeMessage');
    if (welcomeElement && contentData.welcomeMessage) {
        welcomeElement.textContent = contentData.welcomeMessage;
    }
}

// Populate news ticker
function populateNewsTicker() {
    const tickerElement = document.getElementById('newsTicker');
    if (tickerElement && contentData.newsTicker) {
        // Define icons for different news types
        const newsIcons = [
            '📢', // Announcement
            '🕌', // Mosque/Islamic
            '📅', // Event/Date
            '🎓', // Education
            '🤝', // Community/Partnership
            '📋', // Application/Form
        ];
        
        // Create news items as clickable articles with icons
        const newsItems = contentData.newsTicker.map((news, index) => {
            const icon = newsIcons[index % newsIcons.length];
            return `<a href="#" class="ticker-item" data-news-index="${index}">
                <span class="ticker-icon">${icon}</span>
                <span class="ticker-text">${news}</span>
            </a>`;
        }).join('');
        
        // Duplicate news items for seamless scrolling
        tickerElement.innerHTML = newsItems + newsItems;
        
        // Add hover functionality
        addTickerHoverFunctionality();
        
        // Add click functionality
        addTickerClickFunctionality();
    }
}

// Add hover to stop functionality
function addTickerHoverFunctionality() {
    const tickerElement = document.getElementById('newsTicker');
    if (tickerElement) {
        tickerElement.addEventListener('mouseenter', () => {
            tickerElement.style.animationPlayState = 'paused';
        });
        
        tickerElement.addEventListener('mouseleave', () => {
            tickerElement.style.animationPlayState = 'running';
        });
    }
}

// Add click functionality to news items
function addTickerClickFunctionality() {
    const tickerItems = document.querySelectorAll('.ticker-item');
    tickerItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const newsIndex = e.target.dataset.newsIndex;
            const newsText = e.target.textContent;
            showNewsDetail(newsText, newsIndex);
        });
    });
}

// Show news detail modal
function showNewsDetail(newsText, index) {
    // Remove existing modal if any
    const existingModal = document.querySelector('.news-detail-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal HTML
    const modalHTML = `
        <div class="news-detail-modal">
            <div class="news-detail-content">
                <div class="news-detail-header">
                    <h3>News Update</h3>
                    <button class="news-detail-close" id="newsDetailClose">&times;</button>
                </div>
                <div class="news-detail-body">
                    <div class="news-detail-item">
                        <div class="news-detail-date">${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                        <h4 class="news-detail-title">Latest News</h4>
                        <p class="news-detail-text">${newsText}</p>
                        <div class="news-detail-actions">
                            <button class="news-detail-btn" onclick="shareNews('${encodeURIComponent(newsText)}')">Share</button>
                            <button class="news-detail-btn" onclick="printNews()">Print</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Get modal elements
    const modal = document.querySelector('.news-detail-modal');
    const closeBtn = document.getElementById('newsDetailClose');
    
    // Close modal events
    closeBtn.addEventListener('click', closeNewsDetail);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeNewsDetail();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeNewsDetail();
        }
    });
}

// Close news detail modal
function closeNewsDetail() {
    const modal = document.querySelector('.news-detail-modal');
    if (modal) {
        modal.remove();
    }
}

// Share news functionality
function shareNews(newsText) {
    if (navigator.share) {
        navigator.share({
            title: 'NMCL News Update',
            text: decodeURIComponent(newsText),
            url: window.location.href
        });
    } else {
        // Fallback: copy to clipboard
        const text = decodeURIComponent(newsText);
        navigator.clipboard.writeText(text).then(() => {
            alert('News copied to clipboard!');
        });
    }
}

// Print news functionality
function printNews() {
    const newsContent = document.querySelector('.news-detail-text').textContent;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>NMCL News Update</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    h2 { color: #009900; }
                    .date { color: #666; font-style: italic; }
                </style>
            </head>
            <body>
                <h2>National Muslim Council of Liberia</h2>
                <p class="date">${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <h3>Latest News</h3>
                <p>${newsContent}</p>
                <hr>
                <p><small>© 2026 National Muslim Council of Liberia</small></p>
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Populate hero slider
function populateHeroSlider() {
    const sliderWrapper = document.getElementById('sliderWrapper');
    const sliderDots = document.getElementById('sliderDots');
    
    // Clear existing content
    sliderWrapper.innerHTML = '';
    sliderDots.innerHTML = '';
    
    if (sliderWrapper && contentData.heroSlides) {
        slides = contentData.heroSlides;
        
        // Create slides
        slides.forEach((slide, index) => {
            const slideElement = document.createElement('div');
            slideElement.className = 'slide';
            slideElement.innerHTML = `
                <div class="slide-image">
                    <img src="assets/${slide.image}" alt="${slide.title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y4ZjlmYSIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbGlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPgogICAgSW1hZ2UgTm90IEZvdW5kCiAgPC90ZXh0Pgo8L3N2Zz4K'">
                </div>
                <div class="slide-content">
                    <div class="slide-text">
                        <h2>${slide.title}</h2>
                        <p>${slide.description}</p>
                        <button class="find-out-more-btn" data-slide-index="${index}" data-link="${slide.buttonLink || '#'}">
                            ${slide.buttonText || 'Find Out More'}
                            <span class="btn-active-line"></span>
                        </button>
                    </div>
                </div>
            `;
            sliderWrapper.appendChild(slideElement);
        });
        
        // Create dots
        slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.className = 'dot';
            dot.addEventListener('click', () => goToSlide(index));
            sliderDots.appendChild(dot);
        });
        
        // Initialize slider
        updateSlider();
        
        // Add button click handlers
        addSliderButtonHandlers();
    }
}

// Add slider button handlers
function addSliderButtonHandlers() {
    const buttons = document.querySelectorAll('.find-out-more-btn');
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const slideIndex = e.target.dataset.slideIndex;
            const link = e.target.dataset.link;
            const slide = slides[slideIndex];
            
            if (link && link !== '#') {
                // Navigate to the link if it's a valid anchor
                window.location.href = link;
            } else if (slide) {
                // Show modal if no specific link
                showSlideDetail(slide);
            }
        });
    });
}

// Show slide detail modal
function showSlideDetail(slide) {
    // Remove existing modal if any
    const existingModal = document.querySelector('.slide-detail-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal HTML
    const modalHTML = `
        <div class="slide-detail-modal">
            <div class="slide-detail-content">
                <div class="slide-detail-header">
                    <h3>${slide.title}</h3>
                    <button class="slide-detail-close" id="slideDetailClose">&times;</button>
                </div>
                <div class="slide-detail-body">
                    <div class="slide-detail-image">
                        <img src="assets/${slide.image}" alt="${slide.title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y4ZjlmYSIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPgogICAgSW1hZ2UgTm90IEZvdW5kCiAgPC90ZXh0Pgo8L3N2Zz4K'">
                    </div>
                    <div class="slide-detail-info">
                        <p class="slide-detail-description">${slide.description}</p>
                        <div class="slide-detail-actions">
                            <button class="slide-detail-btn" onclick="shareSlide('${encodeURIComponent(slide.title)}', '${encodeURIComponent(slide.description)}')">Share</button>
                            <button class="slide-detail-btn" onclick="printSlide('${encodeURIComponent(slide.title)}', '${encodeURIComponent(slide.description)}')">Print</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Get modal elements
    const modal = document.querySelector('.slide-detail-modal');
    const closeBtn = document.getElementById('slideDetailClose');
    
    // Close modal events
    closeBtn.addEventListener('click', closeSlideDetail);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeSlideDetail();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeSlideDetail();
        }
    });
}

// Close slide detail modal
function closeSlideDetail() {
    const modal = document.querySelector('.slide-detail-modal');
    if (modal) {
        modal.remove();
    }
}

// Share slide functionality
function shareSlide(title, description) {
    if (navigator.share) {
        navigator.share({
            title: decodeURIComponent(title),
            text: decodeURIComponent(description),
            url: window.location.href
        });
    } else {
        // Fallback: copy to clipboard
        const text = `${decodeURIComponent(title)}\n${decodeURIComponent(description)}`;
        navigator.clipboard.writeText(text).then(() => {
            alert('Content copied to clipboard!');
        });
    }
}

// Print slide functionality
function printSlide(title, description) {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>${decodeURIComponent(title)}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    h2 { color: #009900; }
                    .description { color: #333; line-height: 1.6; }
                </style>
            </head>
            <body>
                <h2>National Muslim Council of Liberia</h2>
                <h3>${decodeURIComponent(title)}</h3>
                <p class="description">${decodeURIComponent(description)}</p>
                <hr>
                <p><small>© 2026 National Muslim Council of Liberia</small></p>
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Populate about section
function populateAboutSection() {
    const aboutTitle = document.getElementById('aboutTitle');
    const aboutContent = document.getElementById('aboutContent');
    const missionContent = document.getElementById('missionContent');
    const visionContent = document.getElementById('visionContent');
    
    if (aboutTitle && contentData.about?.title) {
        aboutTitle.textContent = contentData.about.title;
    }
    if (aboutContent && contentData.about?.content) {
        aboutContent.textContent = contentData.about.content;
    }
    if (missionContent && contentData.mission?.content) {
        missionContent.textContent = contentData.mission.content;
    }
    if (visionContent && contentData.vision?.content) {
        visionContent.textContent = contentData.vision.content;
    }
}

// Populate latest news section
function populateLatestNews() {
    const featuredNewsCard = document.getElementById('featuredNewsCard');
    const latestNewsList = document.getElementById('latestNewsList');
    const announcementList = document.getElementById('announcementList');

    if (!featuredNewsCard || !latestNewsList || !announcementList) {
        return;
    }

    const latestNews = Array.isArray(contentData.latestNews) ? contentData.latestNews : [];
    if (latestNews.length > 0) {
        const [featured, ...moreNews] = latestNews;
        const fallbackImage = 'assets/img/slider/slide1.jpg';
        const featuredImage = featured.image
            ? (featured.image.startsWith('assets/') ? featured.image : `assets/${featured.image}`)
            : fallbackImage;

        featuredNewsCard.innerHTML = `
            <img class="featured-news-media" src="${featuredImage}" alt="${featured.title}" onerror="this.src='${fallbackImage}'">
            <div class="featured-news-body">
                <h3>${featured.title}</h3>
                <p>${featured.content}</p>
                <span class="meta-row">
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M19 4h-1V2h-2v2H8V2H6v2H5C3.9 4 3 4.9 3 6v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/>
                    </svg>
                    ${featured.date || ''}
                </span>
            </div>
        `;

        latestNewsList.innerHTML = moreNews.map(news => `
            <article class="news-list-item">
                <h4 class="news-list-title">${news.title}</h4>
                <span class="meta-row">
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M19 4h-1V2h-2v2H8V2H6v2H5C3.9 4 3 4.9 3 6v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/>
                    </svg>
                    ${news.date || ''}
                </span>
            </article>
        `).join('');
    }

    const fallbackAnnouncements = [
        {
            title: 'Executive Meeting Notice',
            text: 'Quarterly executive council meeting holds this Friday at NMCL headquarters.',
            date: '15 Apr 2026',
            badge: 'New'
        },
        {
            title: 'Hajj Registration Deadline',
            text: 'Final submission date for Hajj documents is approaching. Complete all forms early.',
            date: '22 Apr 2026',
            badge: 'Urgent'
        },
        {
            title: 'Community Outreach Volunteers',
            text: 'Volunteers are needed for this month\'s medical and education outreach.',
            date: '28 Apr 2026'
        }
    ];

    const announcements = Array.isArray(contentData.announcements) && contentData.announcements.length
        ? contentData.announcements
        : fallbackAnnouncements;

    announcementList.innerHTML = announcements.map(item => `
        <article class="announcement-card">
            <div class="announcement-top">
                <h4 class="announcement-title">${item.title}</h4>
                ${item.badge ? `<span class="badge ${item.badge.toLowerCase() === 'urgent' ? 'urgent' : 'new'}">${item.badge}</span>` : ''}
            </div>
            <p class="announcement-text">${item.text || ''}</p>
            <span class="announcement-meta">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M19 4h-1V2h-2v2H8V2H6v2H5C3.9 4 3 4.9 3 6v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/>
                </svg>
                ${item.date || ''}
            </span>
            ${(item.readUrl || item.downloadUrl) ? `
                <div class="announcement-actions">
                    ${item.readUrl ? `<a href="${item.readUrl}" target="_blank" rel="noopener" class="announcement-link">Read</a>` : ''}
                    ${item.downloadUrl ? `<a href="${item.downloadUrl}" download class="announcement-link">Download</a>` : ''}
                </div>
            ` : ''}
        </article>
    `).join('');
}

function initializeNewsActions() {
    const viewAllNewsBtn = document.getElementById('viewAllNewsBtn');
    const viewAllAnnouncementsBtn = document.getElementById('viewAllAnnouncementsBtn');

    if (viewAllNewsBtn) {
        viewAllNewsBtn.addEventListener('click', function(event) {
            event.preventDefault();
            showAllNewsModal();
        });
    }

    if (viewAllAnnouncementsBtn) {
        viewAllAnnouncementsBtn.addEventListener('click', function(event) {
            event.preventDefault();
            showAllAnnouncementsModal();
        });
    }
}

function showAllNewsModal() {
    const latestNews = Array.isArray(contentData.latestNews) ? contentData.latestNews : [];
    const newsItems = latestNews.length ? latestNews : [
        { title: 'No news available', content: 'Please check back later for updates.', date: '' }
    ];

    const bodyHtml = newsItems.map(item => `
        <article class="news-modal-item">
            <h4>${item.title || ''}</h4>
            <p>${item.content || ''}</p>
            <span class="news-modal-date">${item.date || ''}</span>
        </article>
    `).join('');

    openNewsAnnouncementModal('All News', bodyHtml);
}

function showAllAnnouncementsModal() {
    const fallbackAnnouncements = [
        {
            title: 'Executive Meeting Notice',
            text: 'Quarterly executive council meeting holds this Friday at NMCL headquarters.',
            date: '15 Apr 2026',
            badge: 'New'
        },
        {
            title: 'Hajj Registration Deadline',
            text: 'Final submission date for Hajj documents is approaching. Complete all forms early.',
            date: '22 Apr 2026',
            badge: 'Urgent'
        },
        {
            title: 'Community Outreach Volunteers',
            text: 'Volunteers are needed for this month\'s medical and education outreach.',
            date: '28 Apr 2026'
        }
    ];

    const announcements = Array.isArray(contentData.announcements) && contentData.announcements.length
        ? contentData.announcements
        : fallbackAnnouncements;

    const bodyHtml = announcements.map(item => `
        <article class="news-modal-item">
            <div class="news-modal-top">
                <h4>${item.title || ''}</h4>
                ${item.badge ? `<span class="badge ${item.badge.toLowerCase() === 'urgent' ? 'urgent' : 'new'}">${item.badge}</span>` : ''}
            </div>
            <p>${item.text || ''}</p>
            <span class="news-modal-date">${item.date || ''}</span>
            ${(item.readUrl || item.downloadUrl) ? `
                <div class="announcement-actions">
                    ${item.readUrl ? `<a href="${item.readUrl}" target="_blank" rel="noopener" class="announcement-link">Read</a>` : ''}
                    ${item.downloadUrl ? `<a href="${item.downloadUrl}" download class="announcement-link">Download</a>` : ''}
                </div>
            ` : ''}
        </article>
    `).join('');

    openNewsAnnouncementModal('All Announcements', bodyHtml);
}

function openNewsAnnouncementModal(title, bodyHtml) {
    const existingModal = document.querySelector('.news-announcement-modal');
    if (existingModal) {
        existingModal.remove();
    }

    const modalHtml = `
        <div class="news-announcement-modal">
            <div class="news-announcement-content">
                <div class="news-announcement-header">
                    <h3>${title}</h3>
                    <button class="news-announcement-close" id="newsAnnouncementClose" aria-label="Close">&times;</button>
                </div>
                <div class="news-announcement-body">
                    ${bodyHtml}
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const modal = document.querySelector('.news-announcement-modal');
    const closeBtn = document.getElementById('newsAnnouncementClose');

    if (closeBtn) {
        closeBtn.addEventListener('click', closeNewsAnnouncementModal);
    }

    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeNewsAnnouncementModal();
            }
        });
    }

    document.addEventListener('keydown', closeNewsAnnouncementOnEscape);
}

function closeNewsAnnouncementOnEscape(event) {
    if (event.key === 'Escape') {
        closeNewsAnnouncementModal();
    }
}

function closeNewsAnnouncementModal() {
    const modal = document.querySelector('.news-announcement-modal');
    if (modal) {
        modal.remove();
    }

    document.removeEventListener('keydown', closeNewsAnnouncementOnEscape);
}

// Populate footer
function populateFooter() {
    const footerElement = document.getElementById('footerContent');
    if (footerElement && contentData.footer) {
        footerElement.textContent = contentData.footer.text;
    }
}

// Initialize slider functionality
function initializeSlider() {
    if (slides.length === 0) return;
    
    // Get elements
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dots = document.querySelectorAll('.dot');
    const sliderContainer = document.querySelector('.slider-container');
    
    // Add event listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            clearInterval(autoSlideInterval);
            changeSlide(-1);
            startAutoSlide();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            clearInterval(autoSlideInterval);
            changeSlide(1);
            startAutoSlide();
        });
    }
    
    // Add dot click handlers
    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            clearInterval(autoSlideInterval);
            const slideIndex = parseInt(e.target.dataset.slide);
            goToSlide(slideIndex);
            startAutoSlide();
        });
    });
    
    // Add touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    sliderContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    sliderContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            clearInterval(autoSlideInterval);
            if (diff > 0) {
                changeSlide(1); // Swipe left, go to next
            } else {
                changeSlide(-1); // Swipe right, go to previous
            }
            startAutoSlide();
        }
    }
    
    // Start auto-slide
    startAutoSlide();
    
    // Pause auto-slide on hover
    sliderContainer.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });
    
    sliderContainer.addEventListener('mouseleave', () => {
        startAutoSlide();
    });
}

// Change slide function
function changeSlide(direction) {
    currentSlide += direction;
    
    if (currentSlide >= slides.length) {
        currentSlide = 0;
    } else if (currentSlide < 0) {
        currentSlide = slides.length - 1;
    }
    
    updateSlider();
}

// Go to specific slide
function goToSlide(slideIndex) {
    currentSlide = slideIndex;
    updateSlider();
}

// Update slider
function updateSlider() {
    const sliderWrapper = document.getElementById('sliderWrapper');
    const dots = document.querySelectorAll('.dot');
    
    // Move slider horizontally
    sliderWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Update dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

// Start auto-slide
function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        changeSlide(1);
    }, 5000); // Change slide every 5 seconds
}

// Initialize search functionality
function initializeSearch() {
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            // Create search modal
            createSearchModal();
        });
    }
}

// Create search modal
function createSearchModal() {
    // Remove existing modal if any
    const existingModal = document.querySelector('.search-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal HTML
    const modalHTML = `
        <div class="search-modal">
            <div class="search-modal-content">
                <div class="search-modal-header">
                    <h3>Search NMCL Website</h3>
                    <button class="search-modal-close" id="searchModalClose">&times;</button>
                </div>
                <div class="search-modal-body">
                    <input type="text" class="search-input" id="searchInput" placeholder="Search for content, news, events...">
                    <button class="search-submit-btn" id="searchSubmitBtn">Search</button>
                </div>
                <div class="search-results" id="searchResults"></div>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Get modal elements
    const modal = document.querySelector('.search-modal');
    const closeBtn = document.getElementById('searchModalClose');
    const searchInput = document.getElementById('searchInput');
    const searchSubmitBtn = document.getElementById('searchSubmitBtn');
    
    // Close modal events
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Search functionality
    searchSubmitBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Focus on search input
    setTimeout(() => searchInput.focus(), 100);
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// Back to top button
function initializeBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
}

// Initialize publications functionality
function initializePublications() {
    const categorySelect = document.getElementById('categorySelect');
    if (categorySelect) {
        categorySelect.addEventListener('change', handleCategoryChange);
    }
}

// Handle category selection change
function handleCategoryChange(event) {
    const category = event.target.value;
    const documentsList = document.getElementById('documentsList');
    
    if (!category) {
        documentsList.innerHTML = '';
        return;
    }
    
    // Get documents for the selected category
    const documents = getDocumentsByCategory(category);
    
    // Display documents
    displayDocuments(documents);
}

// Get documents by category
function getDocumentsByCategory(category) {
    const documentsData = {
        'annual-reports': [
            {
                title: 'Annual Report 2025',
                description: 'Comprehensive report on NMCL activities and achievements for 2025.',
                file: 'documents/annual-report-2025.pdf'
            },
            {
                title: 'Annual Report 2024',
                description: 'Detailed overview of organizational progress and community impact.',
                file: 'documents/annual-report-2024.pdf'
            }
        ],
        'souvenirs': [
            {
                title: 'Ramadan Souvenir 2025',
                description: 'Beautiful Ramadan souvenir booklet with prayers and reflections.',
                file: 'documents/ramadan-souvenir-2025.pdf'
            },
            {
                title: 'Eid Souvenir 2025',
                description: 'Special Eid celebration souvenir with community highlights.',
                file: 'documents/eid-souvenir-2025.pdf'
            },
            {
                title: 'NMCL Souvenir',
                description: 'Official NMCL souvenir booklet with organizational highlights.',
                file: 'assets/documents/nmcl souvenir finally  (2).pdf'
            }
        ],
        'project-documents': [
            {
                title: 'Community Health Initiative',
                description: 'Documentation of our healthcare outreach programs.',
                file: 'documents/health-initiative-2025.pdf'
            },
            {
                title: 'Education Program Report',
                description: 'Islamic education initiatives and student achievements.',
                file: 'documents/education-program-2025.pdf'
            }
        ],
        'letter-conventions': [
            {
                title: 'Official Correspondence 2025',
                description: 'Collection of official letters and communications.',
                file: 'documents/correspondence-2025.pdf'
            },
            {
                title: 'Convention Agreements',
                description: 'Agreements and conventions from various meetings.',
                file: 'documents/conventions-2025.pdf'
            }
        ],
        'policy-documents': [
            {
                title: 'Organizational Policies',
                description: 'Complete policy manual and guidelines.',
                file: 'documents/policies-2025.pdf'
            },
            {
                title: 'Code of Conduct',
                description: 'Ethical guidelines and conduct standards.',
                file: 'documents/code-of-conduct-2025.pdf'
            }
        ],
        'event-programs': [
            {
                title: 'Ramadan Program 2025',
                description: 'Complete schedule for Ramadan activities and events.',
                file: 'documents/ramadan-program-2025.pdf'
            },
            {
                title: 'Youth Summit Program',
                description: 'Program details for the annual youth leadership summit.',
                file: 'documents/youth-summit-2025.pdf'
            }
        ],
        'conventions': [
            {
                title: 'National Convention 2025',
                description: 'Proceedings and resolutions from the annual national convention.',
                file: 'documents/national-convention-2025.pdf'
            },
            {
                title: 'Regional Conventions 2025',
                description: 'Documentation of regional convention meetings and agreements.',
                file: 'documents/regional-conventions-2025.pdf'
            }
        ],
        'constitutions': [
            {
                title: 'NMCL Constitution',
                description: 'The official constitution and bylaws of the National Muslim Council of Liberia.',
                file: 'documents/nmcl-constitution.pdf'
            },
            {
                title: 'Constitution Amendments',
                description: 'Historical amendments and updates to the organizational constitution.',
                file: 'documents/constitution-amendments.pdf'
            },
            {
                title: 'Constitution and Bylaws 2021',
                description: 'Official constitution and bylaws of the National Muslim Council of Liberia (2021).',
                file: 'assets/documents/Constitution and Bylaws of the National Muslim Council of Liberia 2021 (2).pdf'
            }
        ]
    };
    
    return documentsData[category] || [];
}

// Display documents in the list
function displayDocuments(documents) {
    const documentsList = document.getElementById('documentsList');
    
    if (documents.length === 0) {
        documentsList.innerHTML = '<p class="no-documents">No documents found in this category.</p>';
        return;
    }
    
    const documentsHTML = documents.map(doc => `
        <div class="document-item">
            <div class="document-info">
                <h4>${doc.title}</h4>
                <p>${doc.description}</p>
            </div>
            <div class="document-actions">
                <a href="${doc.file}" target="_blank" class="btn-view">View</a>
                <a href="${doc.file}" download class="btn-download">Download</a>
            </div>
        </div>
    `).join('');
    
    documentsList.innerHTML = documentsHTML;
}

// Close search modal
function closeModal() {
    const modal = document.querySelector('.search-modal');
    if (modal) {
        modal.remove();
    }
}

// Perform search
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const query = searchInput.value.trim().toLowerCase();
    
    if (!query) {
        searchResults.innerHTML = '<p class="search-message">Please enter a search term.</p>';
        return;
    }
    
    // Search through content
    const results = [];
    
    // Search in hero slides
    if (contentData.heroSlides) {
        contentData.heroSlides.forEach(slide => {
            if (slide.title.toLowerCase().includes(query) || 
                slide.description.toLowerCase().includes(query)) {
                results.push({
                    type: 'Hero Slide',
                    title: slide.title,
                    content: slide.description,
                    section: 'Home'
                });
            }
        });
    }
    
    // Search in news ticker
    if (contentData.newsTicker) {
        contentData.newsTicker.forEach(news => {
            if (news.toLowerCase().includes(query)) {
                results.push({
                    type: 'News',
                    title: 'News Update',
                    content: news,
                    section: 'News'
                });
            }
        });
    }
    
    // Search in main content
    if (contentData.mainContent) {
        const about = contentData.mainContent.about;
        if (about && (about.title.toLowerCase().includes(query) || 
                     about.content.toLowerCase().includes(query))) {
            results.push({
                type: 'About',
                title: about.title,
                content: about.content,
                section: 'About'
            });
        }
        
        if (contentData.mainContent.mission && 
            contentData.mainContent.mission.toLowerCase().includes(query)) {
            results.push({
                type: 'Mission',
                title: 'Our Mission',
                content: contentData.mainContent.mission,
                section: 'About'
            });
        }
        
        if (contentData.mainContent.vision && 
            contentData.mainContent.vision.toLowerCase().includes(query)) {
            results.push({
                type: 'Vision',
                title: 'Our Vision',
                content: contentData.mainContent.vision,
                section: 'About'
            });
        }
    }
    
    // Display results
    displaySearchResults(results, query);
}

// Display search results
function displaySearchResults(results, query) {
    const searchResults = document.getElementById('searchResults');
    
    if (results.length === 0) {
        searchResults.innerHTML = `<p class="search-message">No results found for "${query}".</p>`;
        return;
    }
    
    const resultsHTML = results.map(result => `
        <div class="search-result-item">
            <div class="search-result-type">${result.type}</div>
            <h4 class="search-result-title">${result.title}</h4>
            <p class="search-result-content">${highlightText(result.content, query)}</p>
            <div class="search-result-section">Section: ${result.section}</div>
        </div>
    `).join('');
    
    searchResults.innerHTML = `
        <div class="search-results-header">
            <h4>Found ${results.length} result${results.length > 1 ? 's' : ''} for "${query}":</h4>
        </div>
        ${resultsHTML}
    `;
}

// Highlight search text
function highlightText(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

// Update date and time display
function updateDateTime() {
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const dateString = now.toLocaleDateString('en-US', options);
        dateElement.textContent = `📅 ${dateString}`;
    }
}

// Fallback content if JSON fails to load
function loadFallbackContent() {
    console.log('Loading fallback content');
    
    // Set default values
    document.getElementById('welcomeMessage').textContent = 'Welcome to the National Muslim Council of Liberia';
    document.getElementById('navigation').innerHTML = `
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#news">News</a></li>
        <li><a href="#contact">Contact</a></li>
    `;
    
    // Default news ticker
    const defaultNews = [
        'NMCL announces annual Ramadan Iftar gatherings across Liberia',
        'Registration now open for Islamic Summer School 2026',
        'Joint interfaith peace summit scheduled for next month'
    ];
    
    const tickerElement = document.getElementById('newsTicker');
    if (tickerElement) {
        const duplicatedNews = [...defaultNews, ...defaultNews];
        tickerElement.innerHTML = duplicatedNews.map(news => 
            `<span>${news}</span>`
        ).join('');
    }
    
    // Default hero slides
    const defaultSlides = [
        {
            title: "Welcome to NMCL",
            description: "The unified voice of Muslims in Liberia",
            image: "thumb1.jpg"
        },
        {
            title: "Community Service",
            description: "Serving humanity through faith and compassion",
            image: "thumb2.jpg"
        },
        {
            title: "Islamic Education",
            description: "Empowering minds through knowledge and wisdom",
            image: "thumb3.jpg"
        }
    ];
    
    slides = defaultSlides;
    populateHeroSlider();
    initializeSlider();
    
    // Default footer
    document.getElementById('footerContent').textContent = ' 2026 National Muslim Council of Liberia. All rights reserved.';
}

// Mobile navigation toggle
function initializeMobileNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navigation = document.getElementById('navigation');
    
    if (navToggle && navigation) {
        navToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navigation.classList.toggle('mobile-nav-open');
            
            // Close menu when clicking outside
            document.addEventListener('click', function closeNav(e) {
                if (!navToggle.contains(e.target) && !navigation.contains(e.target)) {
                    navToggle.classList.remove('active');
                    navigation.classList.remove('mobile-nav-open');
                    document.removeEventListener('click', closeNav);
                }
            });
            
            // Close menu when clicking on a navigation link
            const navLinks = navigation.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    navToggle.classList.remove('active');
                    navigation.classList.remove('mobile-nav-open');
                });
            });
        });
    }
}

// Mobile menu toggle
function initializeMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const infoCards = document.querySelector('.info-cards');
    
    if (mobileMenuToggle && infoCards) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            infoCards.classList.toggle('mobile-menu-open');
            
            // Close menu when clicking outside
            document.addEventListener('click', function closeMenu(e) {
                if (!mobileMenuToggle.contains(e.target) && !infoCards.contains(e.target)) {
                    mobileMenuToggle.classList.remove('active');
                    infoCards.classList.remove('mobile-menu-open');
                    document.removeEventListener('click', closeMenu);
                }
            });
        });
    }
}

function reportNmcFirebaseConfigStatus() {
    const config = window.nmcFirebaseConfig;
    const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'appId'];

    if (!config) {
        console.warn('[NMC] Firebase config not found. Load firebase.js before js/script.js.');
        return;
    }

    const missingKeys = requiredKeys.filter(function(key) {
        const value = config[key];
        return !value || String(value).includes('YOUR_FIREBASE_');
    });

    if (missingKeys.length) {
        console.warn('[NMC] Firebase config loaded, but missing required keys:', missingKeys.join(', '));
        return;
    }

    console.info('[NMC] Firebase config loaded successfully for project:', config.projectId || 'unknown-project');
}

function isNmcFirebaseConfigured(config) {
    const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'appId'];

    return requiredKeys.every(function(key) {
        const value = config[key];
        return value && !String(value).includes('YOUR_FIREBASE_');
    });
}

function getNmcFirebaseServices() {
    const firebaseConfig = window.nmcFirebaseConfig || {};

    if (!window.firebase || typeof window.firebase.initializeApp !== 'function' || typeof window.firebase.firestore !== 'function' || !isNmcFirebaseConfigured(firebaseConfig)) {
        return null;
    }

    if (!window.firebase.apps.length) {
        window.firebase.initializeApp(firebaseConfig);
    }

    return {
        auth: window.firebase.auth(),
        firestore: window.firebase.firestore(),
        firebase: window.firebase
    };
}

function generateNmcMembershipId() {
    if (window.crypto && typeof window.crypto.getRandomValues === 'function') {
        const randomValues = new Uint32Array(1);
        window.crypto.getRandomValues(randomValues);
        return 'NMC-' + String(randomValues[0] % 1000000).padStart(6, '0');
    }

    return 'NMC-' + String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
}

function formatNmcJoinDate(value) {
    let joinDate = null;

    if (!value) {
        return 'Pending';
    }

    if (typeof value.toDate === 'function') {
        joinDate = value.toDate();
    } else if (typeof value.seconds === 'number') {
        joinDate = new Date(value.seconds * 1000);
    } else {
        joinDate = new Date(value);
    }

    if (!(joinDate instanceof Date) || Number.isNaN(joinDate.getTime())) {
        return 'Pending';
    }

    return joinDate.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function initializeMembershipSystem() {
    const modal = document.getElementById('nmc-member-modal');
    const dialog = modal ? modal.querySelector('.nmc-member-dialog') : null;
    const form = document.getElementById('nmc-member-form');
    const closeButton = document.getElementById('nmc-member-close');
    const cancelButton = document.getElementById('nmc-member-cancel');
    const submitButton = document.getElementById('nmc-member-submit');
    const switchButton = document.getElementById('nmc-member-switch');
    const modalTitle = document.getElementById('nmc-member-modal-title');
    const modalCopy = document.getElementById('nmc-member-modal-copy');
    const modalKicker = document.getElementById('nmc-member-modal-kicker');
    const feedback = document.getElementById('nmc-member-feedback');
    const status = document.getElementById('nmc-member-status');
    const toast = document.getElementById('nmc-member-toast');
    const authPanel = document.getElementById('nmc-member-auth-panel');
    const dashboard = document.getElementById('nmc-member-dashboard');
    const logoutButton = document.getElementById('nmc-member-logout');
    const nameField = document.getElementById('nmc-member-name-field');
    const confirmField = document.getElementById('nmc-member-confirm-field');
    const nameInput = document.getElementById('nmc-member-full-name');
    const emailInput = document.getElementById('nmc-member-email-input');
    const passwordInput = document.getElementById('nmc-member-password');
    const confirmInput = document.getElementById('nmc-member-confirm-password');
    const nameOutput = document.getElementById('nmc-member-name');
    const emailOutput = document.getElementById('nmc-member-email');
    const membershipIdOutput = document.getElementById('nmc-member-id');
    const joinDateOutput = document.getElementById('nmc-member-join-date');
    const verificationOutput = document.getElementById('nmc-member-verification');
    const triggers = document.querySelectorAll('[data-nmc-member-modal-mode]');

    if (!modal || !dialog || !form || !closeButton || !cancelButton || !submitButton || !switchButton || !modalTitle || !modalCopy || !modalKicker || !feedback || !status || !toast || !authPanel || !dashboard || !logoutButton || !nameField || !confirmField || !nameInput || !emailInput || !passwordInput || !confirmInput || !nameOutput || !emailOutput || !membershipIdOutput || !joinDateOutput || !verificationOutput || !triggers.length) {
        return;
    }

    const services = getNmcFirebaseServices();
    const membershipConfig = window.nmcMembershipConfig || {};
    const collectionName = membershipConfig.collectionName || 'members';
    const registerText = submitButton.getAttribute('data-nmc-register-text') || 'Become a Member';
    const loginText = submitButton.getAttribute('data-nmc-login-text') || 'Sign In';
    const modeLabels = {
        register: {
            kicker: 'Membership Registration',
            title: 'Become a Member',
            copy: 'Create your verified member account to access the NMCL dashboard.',
            submitText: registerText,
            switchText: 'Already a member? Sign in',
            nextMode: 'login'
        },
        login: {
            kicker: 'Member Login',
            title: 'Access Your Dashboard',
            copy: 'Sign in with your member account to view your membership details.',
            submitText: loginText,
            switchText: 'Need an account? Become a member',
            nextMode: 'register'
        }
    };

    let currentMode = 'register';
    let lastFocusedElement = null;
    let memberDocUnsubscribe = null;

    function setFeedback(message, isError) {
        feedback.textContent = message;
        feedback.classList.toggle('nmc-member-feedback-error', Boolean(isError));
    }

    function setStatus(message, isError) {
        status.textContent = message;
        status.classList.toggle('nmc-member-status-error', Boolean(isError));
    }

    function showToast(message, isError) {
        toast.textContent = message;
        toast.classList.toggle('nmc-member-toast-error', Boolean(isError));
        toast.classList.add('nmc-member-toast-show');

        window.setTimeout(function() {
            toast.classList.remove('nmc-member-toast-show');
        }, 4200);
    }

    function setSubmitting(isSubmitting) {
        const busyText = currentMode === 'register' ? 'Creating account...' : 'Signing in...';

        submitButton.disabled = isSubmitting;
        cancelButton.disabled = isSubmitting;
        closeButton.disabled = isSubmitting;
        switchButton.disabled = isSubmitting;
        submitButton.textContent = isSubmitting ? busyText : modeLabels[currentMode].submitText;
    }

    function setMode(mode) {
        const nextMode = mode === 'login' ? 'login' : 'register';
        const isLoginMode = nextMode === 'login';
        const labels = modeLabels[nextMode];

        currentMode = nextMode;
        modalKicker.textContent = labels.kicker;
        modalTitle.textContent = labels.title;
        modalCopy.textContent = labels.copy;
        submitButton.textContent = labels.submitText;
        switchButton.textContent = labels.switchText;
        switchButton.setAttribute('data-nmc-mode', labels.nextMode);
        nameField.hidden = isLoginMode;
        confirmField.hidden = isLoginMode;
        nameInput.required = !isLoginMode;
        confirmInput.required = !isLoginMode;
        passwordInput.autocomplete = isLoginMode ? 'current-password' : 'new-password';
        confirmInput.autocomplete = isLoginMode ? 'current-password' : 'new-password';
        setFeedback('', false);
    }

    function openModal(mode) {
        lastFocusedElement = document.activeElement;
        setMode(mode);
        modal.hidden = false;
        modal.setAttribute('aria-hidden', 'false');
        modal.classList.add('nmc-member-open');
        document.body.classList.add('nmc-member-body-locked');
        setSubmitting(false);

        window.requestAnimationFrame(function() {
            if (currentMode === 'register') {
                nameInput.focus();
            } else {
                emailInput.focus();
            }
        });
    }

    function closeModal() {
        modal.classList.remove('nmc-member-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('nmc-member-body-locked');
        window.setTimeout(function() {
            if (!modal.classList.contains('nmc-member-open')) {
                modal.hidden = true;
            }
        }, 280);

        if (lastFocusedElement instanceof HTMLElement) {
            lastFocusedElement.focus();
        }
    }

    function resetDashboard() {
        nameOutput.textContent = '-';
        emailOutput.textContent = '-';
        membershipIdOutput.textContent = '-';
        joinDateOutput.textContent = '-';
        verificationOutput.textContent = '-';
    }

    function removeVerificationParam() {
        const params = new URLSearchParams(window.location.search);

        if (params.get('nmcMemberVerify') !== '1') {
            return;
        }

        params.delete('nmcMemberVerify');
        const queryString = params.toString();
        const nextUrl = window.location.pathname + (queryString ? '?' + queryString : '') + window.location.hash;
        window.history.replaceState({}, document.title, nextUrl);
    }

    function renderMemberData(user, memberData) {
        const verificationText = user.emailVerified ? 'Verified' : 'Pending verification';

        nameOutput.textContent = memberData && memberData.fullName ? memberData.fullName : (user.displayName || 'Pending');
        emailOutput.textContent = memberData && memberData.email ? memberData.email : (user.email || 'Pending');
        membershipIdOutput.textContent = memberData && memberData.membershipID ? memberData.membershipID : 'Pending';
        joinDateOutput.textContent = memberData && memberData.joinDate ? formatNmcJoinDate(memberData.joinDate) : 'Pending';
        verificationOutput.textContent = verificationText;
        authPanel.hidden = true;
        dashboard.hidden = false;

        if (user.emailVerified) {
            setStatus('Your member dashboard is active.', false);
        } else {
            setStatus('Verification email sent. Please check your inbox.', false);
        }
    }

    function subscribeToMemberDocument(user) {
        if (!services) {
            return;
        }

        if (memberDocUnsubscribe) {
            memberDocUnsubscribe();
            memberDocUnsubscribe = null;
        }

        memberDocUnsubscribe = services.firestore.collection(collectionName).doc(user.uid).onSnapshot(function(snapshot) {
            renderMemberData(user, snapshot.exists ? snapshot.data() : null);
        }, function(error) {
            console.error('Member dashboard load failed:', error);
            setStatus('Unable to load your membership dashboard right now.', true);
        });
    }

    if (!services) {
        setStatus('Membership login is not configured yet. Add your Firebase keys and enable Firestore.', true);
        resetDashboard();
        return;
    }

    triggers.forEach(function(trigger) {
        trigger.addEventListener('click', function(event) {
            event.preventDefault();
            openModal(trigger.getAttribute('data-nmc-member-modal-mode'));
        });
    });

    closeButton.addEventListener('click', closeModal);
    cancelButton.addEventListener('click', closeModal);
    switchButton.addEventListener('click', function() {
        setMode(switchButton.getAttribute('data-nmc-mode'));
    });

    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    dialog.addEventListener('click', function(event) {
        event.stopPropagation();
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.classList.contains('nmc-member-open')) {
            closeModal();
        }
    });

    logoutButton.addEventListener('click', function() {
        services.auth.signOut()
            .then(function() {
                showToast('You have been logged out.', false);
            })
            .catch(function(error) {
                console.error('Member logout failed:', error);
                showToast('Logout failed. Please try again.', true);
            });
    });

    form.addEventListener('submit', function(event) {
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const fullName = nameInput.value.trim();
        const confirmPassword = confirmInput.value;
        const isRegisterMode = currentMode === 'register';

        event.preventDefault();

        if (!email || !password || (isRegisterMode && !fullName)) {
            setFeedback('Please complete all required fields.', true);
            return;
        }

        if (!emailInput.checkValidity()) {
            setFeedback('Please enter a valid email address.', true);
            emailInput.focus();
            return;
        }

        if (password.length < 6) {
            setFeedback('Password must be at least 6 characters.', true);
            passwordInput.focus();
            return;
        }

        if (isRegisterMode && password !== confirmPassword) {
            setFeedback('Passwords do not match.', true);
            confirmInput.focus();
            return;
        }

        setSubmitting(true);
        setFeedback(isRegisterMode ? 'Creating your member account...' : 'Signing you in...', false);

        if (isRegisterMode) {
            const actionCodeSettings = {
                url: window.location.origin + window.location.pathname + '?nmcMemberVerify=1',
                handleCodeInApp: false
            };
            const membershipID = generateNmcMembershipId();
            const timestamp = services.firebase.firestore.Timestamp.now();
            const memberRecord = {
                uid: '',
                fullName: fullName,
                email: email,
                joinDate: timestamp,
                membershipID: membershipID
            };

            services.auth.createUserWithEmailAndPassword(email, password)
                .then(function(userCredential) {
                    const user = userCredential.user;
                    memberRecord.uid = user.uid;

                    return user.updateProfile({
                        displayName: fullName
                    }).catch(function() {
                        return null;
                    }).then(function() {
                        return services.firestore.collection(collectionName).doc(user.uid).set(memberRecord);
                    }).then(function() {
                        return user.sendEmailVerification(actionCodeSettings);
                    }).then(function() {
                        renderMemberData(user, memberRecord);
                        setFeedback('Verification email sent. Please check your inbox.', false);
                        setStatus('Verification email sent. Please check your inbox.', false);
                        showToast('Verification email sent. Please check your inbox.', false);
                        form.reset();
                        window.setTimeout(function() {
                            setSubmitting(false);
                            closeModal();
                        }, 1100);
                    });
                })
                .catch(function(error) {
                    console.error('Membership registration failed:', error);
                    setSubmitting(false);
                    if (error.code === 'auth/email-already-in-use') {
                        setFeedback('This email is already in use. Please sign in instead.', true);
                        return;
                    }
                    if (error.code === 'auth/invalid-email') {
                        setFeedback('Please enter a valid email address.', true);
                        return;
                    }
                    if (error.code === 'auth/weak-password') {
                        setFeedback('Password must be at least 6 characters.', true);
                        return;
                    }
                    setFeedback('Unable to create your membership account right now.', true);
                });

            return;
        }

        services.auth.signInWithEmailAndPassword(email, password)
            .then(function() {
                setFeedback('Signed in successfully.', false);
                showToast('Signed in successfully.', false);
                form.reset();
                window.setTimeout(function() {
                    setSubmitting(false);
                    closeModal();
                }, 700);
            })
            .catch(function(error) {
                console.error('Member login failed:', error);
                setSubmitting(false);
                if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                    setFeedback('Incorrect email or password.', true);
                    return;
                }
                if (error.code === 'auth/invalid-email') {
                    setFeedback('Please enter a valid email address.', true);
                    return;
                }
                setFeedback('Unable to sign in right now. Please try again.', true);
            });
    });

    services.auth.onAuthStateChanged(function(user) {
        if (!user) {
            if (memberDocUnsubscribe) {
                memberDocUnsubscribe();
                memberDocUnsubscribe = null;
            }

            resetDashboard();
            dashboard.hidden = true;
            authPanel.hidden = false;
            setStatus('Sign in or create an account to access your member dashboard.', false);
            return;
        }

        user.reload().then(function() {
            subscribeToMemberDocument(user);

            if (user.emailVerified && new URLSearchParams(window.location.search).get('nmcMemberVerify') === '1') {
                showToast('Email verification confirmed. Your membership is active.', false);
                setStatus('Email verification confirmed. Your membership is active.', false);
                removeVerificationParam();
            }
        }).catch(function(error) {
            console.error('Member verification refresh failed:', error);
            subscribeToMemberDocument(user);
        });
    });
}

function initializeRsvpModal() {
    const triggers = document.querySelectorAll('.nmc-rsvp-trigger');
    const modal = document.getElementById('nmc-rsvp-modal');
    const dialog = modal ? modal.querySelector('.nmc-rsvp-dialog') : null;
    const closeButton = document.getElementById('nmc-rsvp-close');
    const cancelButton = document.getElementById('nmc-rsvp-cancel');
    const submitButton = document.getElementById('nmc-rsvp-submit');
    const form = document.getElementById('nmc-rsvp-form');
    const feedback = document.getElementById('nmc-rsvp-feedback');
    const title = document.getElementById('nmc-rsvp-title');
    const copy = modal ? modal.querySelector('.nmc-rsvp-copy') : null;

    if (!triggers.length || !modal || !dialog || !closeButton || !cancelButton || !submitButton || !form || !feedback || !title || !copy) {
        return;
    }

    let lastFocusedElement = null;
    let activeEventName = 'Friday Jummah Khutbah';
    const emailJsConfig = window.nmcEmailJsConfig || {};
    const submitDefaultText = submitButton.getAttribute('data-nmc-default-text') || 'Confirm RSVP';
    const eventDetails = {
        'jummah-khutbah': {
            title: 'RSVP for Friday Jummah Khutbah',
            copy: 'Reserve your place and let us know how many attendees to expect.',
            eventName: 'Friday Jummah Khutbah'
        },
        'family-iftar': {
            title: 'RSVP for Family Iftar Gathering',
            copy: 'Share your attendance details so we can prepare a welcoming family gathering.',
            eventName: 'Family Iftar Gathering'
        }
    };

    function setFeedback(message, isError) {
        feedback.textContent = message;
        feedback.classList.toggle('nmc-rsvp-error', Boolean(isError));
    }

    function setSubmitting(isSubmitting) {
        submitButton.disabled = isSubmitting;
        cancelButton.disabled = isSubmitting;
        closeButton.disabled = isSubmitting;
        submitButton.textContent = isSubmitting ? 'Sending...' : submitDefaultText;
    }

    function openModal(trigger) {
        lastFocusedElement = document.activeElement;
        const eventKey = trigger.getAttribute('data-nmc-rsvp-trigger');
        const details = eventDetails[eventKey] || eventDetails['jummah-khutbah'];

        activeEventName = details.eventName;
        title.textContent = details.title;
        copy.textContent = details.copy;
        modal.hidden = false;
        modal.setAttribute('aria-hidden', 'false');
        modal.classList.add('nmc-rsvp-open');
        document.body.classList.add('nmc-rsvp-body-locked');
        setSubmitting(false);
        setFeedback('', false);
        window.requestAnimationFrame(() => {
            const firstInput = document.getElementById('nmc-rsvp-name');
            if (firstInput) {
                firstInput.focus();
            }
        });
    }

    function closeModal() {
        modal.classList.remove('nmc-rsvp-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('nmc-rsvp-body-locked');
        window.setTimeout(() => {
            if (!modal.classList.contains('nmc-rsvp-open')) {
                modal.hidden = true;
            }
        }, 280);
        if (lastFocusedElement instanceof HTMLElement) {
            lastFocusedElement.focus();
        }
    }

    triggers.forEach(function(trigger) {
        trigger.addEventListener('click', function(event) {
            event.preventDefault();
            openModal(trigger);
        });
    });

    closeButton.addEventListener('click', closeModal);
    cancelButton.addEventListener('click', closeModal);

    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    dialog.addEventListener('click', function(event) {
        event.stopPropagation();
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.classList.contains('nmc-rsvp-open')) {
            closeModal();
        }
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const nameInput = document.getElementById('nmc-rsvp-name');
        const emailInput = document.getElementById('nmc-rsvp-email');
        const phoneInput = document.getElementById('nmc-rsvp-phone');
        const attendeesInput = document.getElementById('nmc-rsvp-attendees');
        const messageInput = document.getElementById('nmc-rsvp-message');
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();
        const attendees = attendeesInput.value;
        const message = messageInput.value.trim();

        if (!name || !email) {
            setFeedback('Please enter your full name and email address.', true);
            return;
        }

        if (!emailInput.checkValidity()) {
            setFeedback('Please enter a valid email address.', true);
            emailInput.focus();
            return;
        }

        if (!window.emailjs || !emailJsConfig.serviceId || !emailJsConfig.templateId || !emailJsConfig.publicKey || emailJsConfig.publicKey === 'YOUR_PUBLIC_KEY' || emailJsConfig.serviceId === 'YOUR_SERVICE_ID' || emailJsConfig.templateId === 'YOUR_TEMPLATE_ID') {
            setFeedback('Email service is not configured yet. Please update the EmailJS keys.', true);
            return;
        }

        setSubmitting(true);
        setFeedback('Sending RSVP...', false);

        emailjs.send(emailJsConfig.serviceId, emailJsConfig.templateId, {
            to_email: emailJsConfig.recipientEmail || 'info@nmcliberia.org',
            from_name: name,
            from_email: email,
            phone: phone,
            attendees: attendees,
            message: message,
            event: activeEventName
        }).then(function() {
            setFeedback('RSVP sent successfully!', false);
            form.reset();
            window.setTimeout(function() {
                setSubmitting(false);
                closeModal();
            }, 900);
        }).catch(function(error) {
            console.error('EmailJS RSVP send failed:', error);
            setSubmitting(false);
            setFeedback('Failed to send RSVP. Please try again.', true);
        });
    });
}

function initializeCommunityRegisterModal() {
    const trigger = document.getElementById('nmc-community-register-trigger');
    const modal = document.getElementById('nmc-register-modal');
    const dialog = modal ? modal.querySelector('.nmc-register-dialog') : null;
    const closeButton = document.getElementById('nmc-register-close');
    const cancelButton = document.getElementById('nmc-register-cancel');
    const submitButton = document.getElementById('nmc-register-submit');
    const form = document.getElementById('nmc-register-form');
    const emailInput = document.getElementById('nmc-register-email');
    const passwordInput = document.getElementById('nmc-register-password');
    const feedback = document.getElementById('nmc-register-feedback');
    const toast = document.getElementById('nmc-register-toast');

    if (!trigger || !modal || !dialog || !closeButton || !cancelButton || !submitButton || !form || !emailInput || !passwordInput || !feedback || !toast) {
        return;
    }

    const firebaseConfig = window.nmcFirebaseConfig || {};
    const submitDefaultText = submitButton.getAttribute('data-nmc-default-text') || 'Register';
    let lastFocusedElement = null;
    let firebaseAuth = null;

    function isFirebaseConfigured(config) {
        const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'appId'];
        return requiredKeys.every(function(key) {
            const value = config[key];
            return value && !String(value).includes('YOUR_FIREBASE_');
        });
    }

    function showToast(message, isError) {
        toast.textContent = message;
        toast.classList.toggle('nmc-register-toast-error', Boolean(isError));
        toast.classList.add('nmc-register-toast-show');
        window.setTimeout(function() {
            toast.classList.remove('nmc-register-toast-show');
        }, 4200);
    }

    function setFeedback(message, isError) {
        feedback.textContent = message;
        feedback.classList.toggle('nmc-register-error', Boolean(isError));
    }

    function setSubmitting(isSubmitting) {
        submitButton.disabled = isSubmitting;
        cancelButton.disabled = isSubmitting;
        closeButton.disabled = isSubmitting;
        submitButton.textContent = isSubmitting ? 'Registering...' : submitDefaultText;
    }

    function openModal() {
        lastFocusedElement = document.activeElement;
        modal.hidden = false;
        modal.setAttribute('aria-hidden', 'false');
        modal.classList.add('nmc-register-open');
        document.body.classList.add('nmc-register-body-locked');
        setSubmitting(false);
        setFeedback('', false);
        window.requestAnimationFrame(function() {
            emailInput.focus();
        });
    }

    function closeModal() {
        modal.classList.remove('nmc-register-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('nmc-register-body-locked');
        window.setTimeout(function() {
            if (!modal.classList.contains('nmc-register-open')) {
                modal.hidden = true;
            }
        }, 280);
        if (lastFocusedElement instanceof HTMLElement) {
            lastFocusedElement.focus();
        }
    }

    function getFriendlyAuthError(code) {
        if (code === 'auth/invalid-email') {
            return 'Please enter a valid email address.';
        }
        if (code === 'auth/weak-password') {
            return 'Password must be at least 6 characters.';
        }
        if (code === 'auth/email-already-in-use') {
            return 'This email is already in use. Please sign in or use another email.';
        }
        return 'Registration failed. Please try again.';
    }

    function initializeFirebaseAuth() {
        if (!window.firebase || !isFirebaseConfigured(firebaseConfig)) {
            return null;
        }
        if (!window.firebase.apps.length) {
            window.firebase.initializeApp(firebaseConfig);
        }
        return window.firebase.auth();
    }

    async function checkVerificationStatusOnReturn() {
        const params = new URLSearchParams(window.location.search);
        const fromVerification = params.get('nmcVerifyEmail') === '1';

        if (!fromVerification || !firebaseAuth) {
            return;
        }

        const user = firebaseAuth.currentUser;
        if (!user) {
            return;
        }

        try {
            await user.reload();
            if (user.emailVerified) {
                showToast('Your email has been verified successfully!', false);
                params.delete('nmcVerifyEmail');
                const queryString = params.toString();
                const nextUrl = window.location.pathname + (queryString ? '?' + queryString : '') + window.location.hash;
                window.history.replaceState({}, document.title, nextUrl);
            }
        } catch (error) {
            console.error('Verification check failed:', error);
        }
    }

    firebaseAuth = initializeFirebaseAuth();
    checkVerificationStatusOnReturn();

    trigger.addEventListener('click', function(event) {
        event.preventDefault();
        openModal();
    });

    closeButton.addEventListener('click', closeModal);
    cancelButton.addEventListener('click', closeModal);

    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    dialog.addEventListener('click', function(event) {
        event.stopPropagation();
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.classList.contains('nmc-register-open')) {
            closeModal();
        }
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!email || !password) {
            setFeedback('Email and password are required.', true);
            return;
        }

        if (!emailInput.checkValidity()) {
            setFeedback('Please enter a valid email address.', true);
            emailInput.focus();
            return;
        }

        if (password.length < 6) {
            setFeedback('Password must be at least 6 characters.', true);
            passwordInput.focus();
            return;
        }

        if (!firebaseAuth) {
            setFeedback('Firebase Authentication is not configured yet. Please update Firebase keys.', true);
            return;
        }

        setSubmitting(true);
        setFeedback('Creating your account...', false);

        firebaseAuth.createUserWithEmailAndPassword(email, password)
            .then(function(userCredential) {
                const user = userCredential.user;
                const actionCodeSettings = {
                    url: window.location.origin + window.location.pathname + '?nmcVerifyEmail=1',
                    handleCodeInApp: false
                };

                return user.sendEmailVerification(actionCodeSettings);
            })
            .then(function() {
                setFeedback('A verification link has been sent to your email. Please verify your account.', false);
                showToast('A verification link has been sent to your email. Please verify your account.', false);
                form.reset();
                window.setTimeout(function() {
                    setSubmitting(false);
                    closeModal();
                }, 1200);
            })
            .catch(function(error) {
                setSubmitting(false);
                setFeedback(getFriendlyAuthError(error.code), true);
            });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadContent();
    initializeSlider();
    initializeMobileNavigation();
    initializeMobileMenu();
    
    // Add smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetSelector = this.getAttribute('href');

            if (!targetSelector || targetSelector === '#') {
                return;
            }

            e.preventDefault();
            const target = document.querySelector(targetSelector);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Handle window resize for responsive slider
window.addEventListener('resize', function() {
    if (slides.length > 0) {
        updateSlider();
    }
});

// Add keyboard navigation for slider
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') {
        clearInterval(autoSlideInterval);
        changeSlide(-1);
        startAutoSlide();
    } else if (e.key === 'ArrowRight') {
        clearInterval(autoSlideInterval);
        changeSlide(1);
        startAutoSlide();
    }
});
