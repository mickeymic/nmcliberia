/**
 * NMC Liberia - Main JavaScript
 * National Muslim Council of Liberia Official Website
 */

/* ============================================================
   1. DOM READY
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
  initHeader();
  initMobileNav();
  initSearch();
  initHeroAnimations();
  initPrayerTimes();
  initAboutTabs();
  initMediaTabs();
  initGalleryLightbox();
  initQA();
  initDonations();
  initRegistrationForm();
  initContactForm();
  initScrollReveal();
  initBackToTop();
  initNewsletterForm();
  initAmountSelector();
  initPaymentMethod();
  initPolicyModal();
  updateActiveNavLink();
  updateScrollNavLinks();
});

/* ============================================================
   2. HEADER - Sticky & Scroll Effects
   ============================================================ */
function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  window.addEventListener('scroll', function () {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* ============================================================
   3. MOBILE NAVIGATION
   ============================================================ */
function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileNavClose = document.getElementById('mobile-nav-close');
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', openMobileNav);
  if (mobileNavClose) mobileNavClose.addEventListener('click', closeMobileNav);

  // Close when clicking overlay (outside inner panel)
  mobileNav.addEventListener('click', function (e) {
    if (e.target === mobileNav) closeMobileNav();
  });

  // Close on nav link click
  const navLinks = mobileNav.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMobileNav();
  });

  function openMobileNav() {
    mobileNav.classList.add('open');
    hamburger.classList.add('open');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeMobileNav() {
    mobileNav.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  }
}

/* ============================================================
   4. SEARCH OVERLAY
   ============================================================ */

// Search data - content indexed for search
const searchData = [
  { title: 'About NMC Liberia', type: 'Page', section: '#about', text: 'National Muslim Council of Liberia established to unite the Muslim community.' },
  { title: 'Leadership Team', type: 'Page', section: '#leadership', text: 'Meet the esteemed leadership of the National Muslim Council of Liberia.' },
  { title: 'Friday Khutbah: Importance of Unity', type: 'News', section: '#news', text: 'The importance of unity among Muslims in Liberia.' },
  { title: 'Ramadan 2026 Program Announced', type: 'News', section: '#news', text: 'Full schedule for Ramadan 2026 activities nationwide.' },
  { title: 'Eid al-Fitr Celebration 2026', type: 'Event', section: '#events', text: 'Annual Eid celebration at Islamic Center, Monrovia.' },
  { title: 'Prayer Times in Monrovia', type: 'Prayer', section: '#prayer-times', text: 'Daily prayer times for Monrovia, Liberia.' },
  { title: 'Audio: Khutbah on Taqwa', type: 'Media', section: '#media', text: 'Audio lecture on the importance of Taqwa (God-consciousness).' },
  { title: 'Introduction to Islam', type: 'Resource', section: '#resources', text: 'Comprehensive guide to the fundamentals of Islam.' },
  { title: 'Member Registration', type: 'Membership', section: '#membership', text: 'Register as a member of the National Muslim Council of Liberia.' },
  { title: 'Donate to NMC', type: 'Donation', section: '#donations', text: 'Support the work of the National Muslim Council of Liberia.' },
  { title: 'Contact Us', type: 'Page', section: '#contact', text: 'Get in touch with the National Muslim Council of Liberia.' },
  { title: 'Urgent: Security Advisory', type: 'Announcement', section: '#news', text: 'Important security guidelines for Muslim community gatherings.' },
  { title: 'Zakat Calculation Guide (PDF)', type: 'Resource', section: '#resources', text: 'Downloadable guide for calculating Zakat.' },
  { title: 'Youth Programs Announcement', type: 'Announcement', section: '#news', text: 'New youth development programs for 2026.' },
];

function initSearch() {
  const searchBtn = document.getElementById('search-btn');
  const searchOverlay = document.getElementById('search-overlay');
  const searchClose = document.getElementById('search-close');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  const searchForm = document.getElementById('search-form');

  if (!searchBtn || !searchOverlay) return;

  searchBtn.addEventListener('click', openSearch);
  if (searchClose) searchClose.addEventListener('click', closeSearch);

  searchOverlay.addEventListener('click', function (e) {
    if (e.target === searchOverlay) closeSearch();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
      closeSearch();
    }
    // Ctrl+K or Cmd+K to open search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      openSearch();
    }
  });

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      performSearch(this.value.trim());
    });
  }

  if (searchForm) {
    searchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const query = searchInput ? searchInput.value.trim() : '';
      if (query) performSearch(query);
    });
  }

  function openSearch() {
    searchOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      if (searchInput) searchInput.focus();
    }, 100);
    if (searchResults) searchResults.innerHTML = '';
  }

  function closeSearch() {
    searchOverlay.classList.remove('active');
    document.body.style.overflow = '';
    if (searchInput) searchInput.value = '';
    if (searchResults) searchResults.innerHTML = '';
  }

  function performSearch(query) {
    if (!searchResults) return;
    if (!query) {
      searchResults.innerHTML = '';
      return;
    }

    const q = query.toLowerCase();
    const results = searchData.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.text.toLowerCase().includes(q) ||
      item.type.toLowerCase().includes(q)
    );

    if (results.length === 0) {
      searchResults.innerHTML = `<p style="color:rgba(255,255,255,0.6);text-align:center;padding:24px;">No results found for "<strong>${escapeHTML(query)}</strong>"</p>`;
      return;
    }

    const html = results.map(item => `
      <div class="search-result-item" onclick="navigateTo('${item.section}')">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
          <h4>${escapeHTML(item.title)}</h4>
          <span class="badge badge-news" style="font-size:0.7rem;">${escapeHTML(item.type)}</span>
        </div>
        <p>${escapeHTML(item.text)}</p>
      </div>
    `).join('');

    searchResults.innerHTML = `
      <p style="color:rgba(255,255,255,0.6);font-size:0.85rem;margin-bottom:12px;">${results.length} result${results.length !== 1 ? 's' : ''} found</p>
      ${html}
    `;
  }
}

function navigateTo(section) {
  // Close search overlay
  const overlay = document.getElementById('search-overlay');
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';

  // Smooth scroll
  const target = document.querySelector(section);
  if (target) {
    setTimeout(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
  }
}

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ============================================================
   5. HERO ANIMATIONS
   ============================================================ */
function initHeroAnimations() {
  // Counter animation for stats
  const statNumbers = document.querySelectorAll('.stat-item .number');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target') || el.textContent.replace(/\D/g, ''), 10);
  const suffix = el.getAttribute('data-suffix') || '';
  if (isNaN(target)) return;

  const duration = 1500;
  const step = Math.ceil(target / (duration / 16));
  let current = 0;

  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current.toLocaleString() + suffix;
    if (current >= target) clearInterval(timer);
  }, 16);
}

/* ============================================================
   6. PRAYER TIMES (Monrovia, Liberia)
   ============================================================ */
function initPrayerTimes() {
  const prayerTimes = calculatePrayerTimes();
  renderPrayerWidget(prayerTimes);
  renderPrayerSection(prayerTimes);
  startPrayerCountdown(prayerTimes);
  updateHijriDate();
}

/**
 * Calculate prayer times using the simplified algorithm for Monrovia, Liberia
 * Coordinates: 6.3°N, 10.8°W
 * Method: Muslim World League
 */
function calculatePrayerTimes(date) {
  date = date || new Date();

  const lat  = 6.3;   // Monrovia latitude
  const lng  = -10.8; // Monrovia longitude
  const tz   = 0;     // UTC offset (Liberia is UTC+0)
  const fajrAngle  = 18;
  const ishaAngle  = 17;

  const jd = julianDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const d  = jd - 2451545.0;

  // Sun's mean longitude (degrees)
  const L = (280.46646 + 0.9856474 * d) % 360;
  // Sun's mean anomaly (degrees)
  const M = (357.52911 + 0.9856003 * d) % 360;
  const Mrad = M * Math.PI / 180;

  // Sun's equation of center
  const C = (1.9146 - 0.004817 * d / 36525 - 0.000014 * Math.pow(d / 36525, 2)) * Math.sin(Mrad)
           + (0.019993 - 0.000101 * d / 36525) * Math.sin(2 * Mrad)
           + 0.00029 * Math.sin(3 * Mrad);

  const sunLon = L + C;
  const Omega = 125.04 - 0.052954 * d;
  const lambda = sunLon - 0.00569 - 0.00478 * Math.sin(Omega * Math.PI / 180);

  // Sun's declination
  const sinDec = Math.sin(23.439 * Math.PI / 180) * Math.sin(lambda * Math.PI / 180);
  const dec = Math.asin(sinDec);

  // Equation of time (minutes)
  const y = Math.tan(23.4393 * Math.PI / 180 / 2);
  const y2 = y * y;
  const Lrad = L * Math.PI / 180;
  const eqTime = 4 * (180 / Math.PI) * (
    y2 * Math.sin(2 * Lrad)
    - 2 * 0.016708634 * Math.sin(Mrad)
    + 4 * 0.016708634 * y2 * Math.sin(Mrad) * Math.cos(2 * Lrad)
    - 0.5 * y2 * y2 * Math.sin(4 * Lrad)
    - 1.25 * Math.pow(0.016708634, 2) * Math.sin(2 * Mrad)
  );

  // Solar noon (in hours, UTC)
  const solarNoon = 12 - lng / 15 - eqTime / 60;

  const latRad = lat * Math.PI / 180;

  // Helper: compute hour angle for a given angle below horizon
  function hourAngle(angle) {
    const cosHA = (Math.sin(angle * Math.PI / 180) - Math.sin(latRad) * sinDec)
                / (Math.cos(latRad) * Math.cos(dec));
    if (Math.abs(cosHA) > 1) return null;
    return Math.acos(cosHA) * 180 / Math.PI / 15;
  }

  // Dhuhr shadow ratio for Asr (standard = 1)
  function asrHourAngle(factor) {
    const angle = -Math.atan(1 / (factor + Math.tan(Math.abs(latRad - dec)))) * 180 / Math.PI;
    return hourAngle(angle);
  }

  const sunriseHA = hourAngle(-0.833);
  const fajrHA    = hourAngle(-fajrAngle);
  const ishaHA    = hourAngle(-ishaAngle);
  const asrHA     = asrHourAngle(1);

  const toLocalHour = (utcH) => utcH + tz;

  const dhuhr   = toLocalHour(solarNoon);
  const sunrise = sunriseHA !== null ? toLocalHour(solarNoon - sunriseHA) : null;
  const fajr    = fajrHA    !== null ? toLocalHour(solarNoon - fajrHA)    : null;
  const asr     = asrHA     !== null ? toLocalHour(dhuhr     + asrHA)     : null;
  const maghrib = sunriseHA !== null ? toLocalHour(solarNoon + sunriseHA) : null;
  const isha    = ishaHA    !== null ? toLocalHour(solarNoon + ishaHA)    : null;

  return {
    fajr:    fajr    !== null ? decimalToTime(fajr)    : '--:--',
    sunrise: sunrise !== null ? decimalToTime(sunrise) : '--:--',
    dhuhr:   decimalToTime(dhuhr),
    asr:     asr     !== null ? decimalToTime(asr)     : '--:--',
    maghrib: maghrib !== null ? decimalToTime(maghrib) : '--:--',
    isha:    isha    !== null ? decimalToTime(isha)    : '--:--',
    _decimal: {
      fajr,
      sunrise,
      dhuhr,
      asr,
      maghrib,
      isha,
    }
  };
}

function julianDate(year, month, day) {
  if (month <= 2) { year -= 1; month += 12; }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
}

function decimalToTime(decimal) {
  if (decimal === null || isNaN(decimal)) return '--:--';
  let h = Math.floor(decimal) % 24;
  if (h < 0) h += 24;
  const m = Math.round((decimal - Math.floor(decimal)) * 60);
  const mm = m === 60 ? '00' : String(m).padStart(2, '0');
  const hh = m === 60 ? String((h + 1) % 24).padStart(2, '0') : String(h).padStart(2, '0');
  const period = h < 12 ? 'AM' : 'PM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${String(h12).padStart(2, '0')}:${mm} ${period}`;
}

function decimalToMinutes(decimal) {
  if (decimal === null || isNaN(decimal)) return null;
  let h = Math.floor(decimal) % 24;
  if (h < 0) h += 24;
  const m = Math.round((decimal - Math.floor(decimal)) * 60);
  return h * 60 + (m === 60 ? 0 : m);
}

function renderPrayerWidget(times) {
  const prayers = [
    { key: 'fajr',    name: 'Fajr',    time: times.fajr    },
    { key: 'dhuhr',   name: 'Dhuhr',   time: times.dhuhr   },
    { key: 'asr',     name: 'Asr',     time: times.asr     },
    { key: 'maghrib', name: 'Maghrib', time: times.maghrib },
    { key: 'isha',    name: 'Isha',    time: times.isha    },
  ];

  const nextPrayer = getNextPrayer(times);
  const widgetList = document.getElementById('prayer-widget-list');
  if (!widgetList) return;

  widgetList.innerHTML = prayers.map(p => `
    <div class="prayer-time-item${p.key === nextPrayer.key ? ' next-prayer' : ''}">
      <span class="prayer-name">${p.name}</span>
      <span class="prayer-time">${p.time}</span>
    </div>
  `).join('');
}

function renderPrayerSection(times) {
  const prayers = [
    { key: 'fajr',    name: 'Fajr',    arabic: 'الفجر',   icon: '🌙', time: times.fajr    },
    { key: 'sunrise', name: 'Sunrise', arabic: 'الشروق',  icon: '🌅', time: times.sunrise },
    { key: 'dhuhr',   name: 'Dhuhr',   arabic: 'الظهر',   icon: '☀️', time: times.dhuhr   },
    { key: 'asr',     name: 'Asr',     arabic: 'العصر',   icon: '🌤️', time: times.asr     },
    { key: 'maghrib', name: 'Maghrib', arabic: 'المغرب',  icon: '🌇', time: times.maghrib },
    { key: 'isha',    name: 'Isha',    arabic: 'العشاء',  icon: '🌃', time: times.isha    },
  ];

  const nextPrayer = getNextPrayer(times);
  const container = document.getElementById('prayer-rows');
  if (!container) return;

  container.innerHTML = prayers.map(p => `
    <div class="prayer-row${p.key === nextPrayer.key ? ' active' : ''}">
      <div class="prayer-label">
        <div class="prayer-icon">${p.icon}</div>
        <div>
          <span>${p.name}</span>
          <span class="prayer-arabic">${p.arabic}</span>
        </div>
      </div>
      <span class="prayer-time-val">${p.time}</span>
    </div>
  `).join('');
}

function getNextPrayer(times) {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const prayers = [
    { key: 'fajr',    minutes: decimalToMinutes(times._decimal.fajr)    },
    { key: 'dhuhr',   minutes: decimalToMinutes(times._decimal.dhuhr)   },
    { key: 'asr',     minutes: decimalToMinutes(times._decimal.asr)     },
    { key: 'maghrib', minutes: decimalToMinutes(times._decimal.maghrib) },
    { key: 'isha',    minutes: decimalToMinutes(times._decimal.isha)    },
  ].filter(p => p.minutes !== null);

  for (const prayer of prayers) {
    if (prayer.minutes > currentMinutes) return prayer;
  }
  return prayers[0]; // If past all prayers, return Fajr (next day)
}

function startPrayerCountdown(times) {
  const countdownEl = document.getElementById('prayer-countdown');
  if (!countdownEl) return;

  function updateCountdown() {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
    const nextPrayer = getNextPrayer(times);

    if (!nextPrayer || nextPrayer.minutes === null) return;

    let diffMinutes = nextPrayer.minutes - currentMinutes;
    if (diffMinutes < 0) diffMinutes += 24 * 60;

    const hours   = Math.floor(diffMinutes / 60);
    const minutes = Math.floor(diffMinutes % 60);
    const seconds = Math.floor((diffMinutes * 60) % 60);

    const prayerName = nextPrayer.key.charAt(0).toUpperCase() + nextPrayer.key.slice(1);
    countdownEl.innerHTML = `Next: <strong>${prayerName}</strong> in ${hours > 0 ? hours + 'h ' : ''}${minutes}m ${seconds}s`;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

function updateHijriDate() {
  const today = new Date();
  const hijri = gregorianToHijri(today.getFullYear(), today.getMonth() + 1, today.getDate());

  const hijriEl = document.getElementById('hijri-date');
  const gregEl  = document.getElementById('gregorian-date');

  if (hijriEl) {
    const months = ['Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
                    'Jumada al-Ula', 'Jumada al-Akhirah', 'Rajab', 'Sha\'ban',
                    'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'];
    hijriEl.textContent = `${hijri.day} ${months[hijri.month - 1]} ${hijri.year} AH`;
  }

  if (gregEl) {
    gregEl.textContent = today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }
}

function gregorianToHijri(gy, gm, gd) {
  // Simplified algorithm
  const jd = Math.floor((1461 * (gy + 4800 + Math.floor((gm - 14) / 12))) / 4)
           + Math.floor((367 * (gm - 2 - 12 * Math.floor((gm - 14) / 12))) / 12)
           - Math.floor((3 * Math.floor((gy + 4900 + Math.floor((gm - 14) / 12)) / 100)) / 4)
           + gd - 32075;

  const l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const l2 = l - 10631 * n + 354;
  const j = Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719)
          + Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
  const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50)
           - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  const month = Math.floor((24 * l3) / 709);
  const day   = l3 - Math.floor((709 * month) / 24);
  const year  = 30 * n + j - 30;

  return { year, month, day };
}

/* ============================================================
   7. ABOUT SECTION TABS (Vision/Mission/Values)
   ============================================================ */
function initAboutTabs() {
  const tabs = document.querySelectorAll('.vmv-tab');
  const panels = document.querySelectorAll('.vmv-panel');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', function () {
      const target = this.getAttribute('data-tab');

      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      this.classList.add('active');
      const panel = document.getElementById('vmv-' + target);
      if (panel) panel.classList.add('active');
    });
  });
}

/* ============================================================
   8. MEDIA SECTION TABS
   ============================================================ */
function initMediaTabs() {
  const tabs = document.querySelectorAll('.media-tab');
  const panels = document.querySelectorAll('.media-panel');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', function () {
      const target = this.getAttribute('data-tab');

      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      this.classList.add('active');
      const panel = document.getElementById('media-' + target);
      if (panel) panel.classList.add('active');
    });
  });
}

/* ============================================================
   9. GALLERY LIGHTBOX
   ============================================================ */
function initGalleryLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxContent = document.getElementById('lightbox-content');
  const galleryItems = document.querySelectorAll('.gallery-item[data-lightbox]');

  if (!lightbox) return;

  galleryItems.forEach(item => {
    item.addEventListener('click', function () {
      const content = this.getAttribute('data-lightbox');
      const caption = this.getAttribute('data-caption') || '';

      if (lightboxContent) {
        lightboxContent.innerHTML = `
          <div style="text-align:center;">
            <div style="font-size:8rem;">${content}</div>
            ${caption ? `<p style="color:rgba(255,255,255,0.7);font-size:0.9rem;margin-top:16px;">${escapeHTML(caption)}</p>` : ''}
          </div>`;
      }
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/* ============================================================
   10. Q&A ACCORDION
   ============================================================ */
function initQA() {
  const qaItems = document.querySelectorAll('.qa-item');

  qaItems.forEach(item => {
    const question = item.querySelector('.question');
    if (!question) return;

    question.addEventListener('click', function () {
      const isOpen = item.classList.contains('open');
      // Close all
      qaItems.forEach(q => q.classList.remove('open'));
      // Open this if it was closed
      if (!isOpen) item.classList.add('open');
    });
  });
}

/* ============================================================
   11. DONATIONS - Amount Selector
   ============================================================ */
function initAmountSelector() {
  // Handled by initDonations
}

function initDonations() {
  const amountBtns = document.querySelectorAll('.amount-btn');
  const customAmount = document.getElementById('custom-amount');

  amountBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      amountBtns.forEach(b => b.classList.remove('selected'));
      this.classList.add('selected');
      if (customAmount) customAmount.value = '';
    });
  });

  if (customAmount) {
    customAmount.addEventListener('input', function () {
      amountBtns.forEach(b => b.classList.remove('selected'));
    });
  }

  const donationForm = document.getElementById('donation-form');
  if (donationForm) {
    donationForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const selectedAmount = document.querySelector('.amount-btn.selected');
      const amount = selectedAmount ? selectedAmount.getAttribute('data-amount')
                   : (customAmount ? customAmount.value : '');
      const method = document.querySelector('.payment-method.selected');

      if (!amount) {
        showToast('Please select or enter a donation amount.', 'warning');
        return;
      }
      if (!method) {
        showToast('Please select a payment method.', 'warning');
        return;
      }

      showToast('Thank you for your generous donation! Payment integration coming soon.', 'success');
      donationForm.reset();
      amountBtns.forEach(b => b.classList.remove('selected'));
      document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('selected'));
    });
  }
}

function initPaymentMethod() {
  const methods = document.querySelectorAll('.payment-method');
  methods.forEach(method => {
    method.addEventListener('click', function () {
      methods.forEach(m => m.classList.remove('selected'));
      this.classList.add('selected');
    });
  });
}

/* ============================================================
   12. REGISTRATION FORM
   ============================================================ */
function initRegistrationForm() {
  const form = document.getElementById('registration-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!validateForm(form)) return;

    // Simulate form submission (replace with actual API call)
    const submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';
    }

    setTimeout(() => {
      showToast('Registration submitted successfully! We will contact you shortly.', 'success');
      form.reset();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Registration';
      }
    }, 1500);
  });
}

/* ============================================================
   13. CONTACT FORM
   ============================================================ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!validateForm(form)) return;

    const submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    }

    setTimeout(() => {
      showToast('Message sent successfully! We will respond within 24 hours.', 'success');
      form.reset();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }
    }, 1500);
  });
}

/* ============================================================
   14. FORM VALIDATION
   ============================================================ */
function validateForm(form) {
  let valid = true;
  const required = form.querySelectorAll('[required]');

  required.forEach(field => {
    const group = field.closest('.form-group');
    const errorEl = group ? group.querySelector('.form-error') : null;

    if (!field.value.trim()) {
      valid = false;
      field.style.borderColor = '#dc2626';
      if (errorEl) errorEl.style.display = 'block';
    } else {
      field.style.borderColor = '';
      if (errorEl) errorEl.style.display = 'none';
    }

    if (field.type === 'email' && field.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value)) {
        valid = false;
        field.style.borderColor = '#dc2626';
      }
    }
  });

  return valid;
}

/* ============================================================
   15. SCROLL REVEAL ANIMATIONS
   ============================================================ */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!elements.length) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add stagger delay based on sibling index
        const siblings = entry.target.parentElement
          ? Array.from(entry.target.parentElement.children).filter(el =>
              el.classList.contains('reveal') ||
              el.classList.contains('reveal-left') ||
              el.classList.contains('reveal-right')
            )
          : [];
        const index = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${index * 0.1}s`;
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* ============================================================
   16. BACK TO TOP
   ============================================================ */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', function () {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================================
   17. NEWSLETTER FORM
   ============================================================ */
function initNewsletterForm() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = form.querySelector('input[type="email"]');
    if (!email || !email.value.trim()) {
      showToast('Please enter a valid email address.', 'warning');
      return;
    }
    showToast('Thank you for subscribing to our newsletter!', 'success');
    form.reset();
  });
}

/* ============================================================
   18. ACTIVE NAV LINK
   ============================================================ */
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

  if (!sections.length || !navLinks.length) return;

  window.addEventListener('scroll', updateScrollNavLinks, { passive: true });
}

function updateScrollNavLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
}

/* ============================================================
   19. TOAST NOTIFICATIONS
   ============================================================ */
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const icons = { success: '✓', error: '✕', warning: '⚠' };
  toast.innerHTML = `
    <span style="font-size:1.1rem;">${icons[type] || '✓'}</span>
    <span>${escapeHTML(message)}</span>
  `;

  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* ============================================================
   20. POLICY MODAL
   ============================================================ */
function initPolicyModal() {
  const policyLink = document.getElementById('policy-link');
  const modal = document.getElementById('policy-modal');
  const modalClose = document.getElementById('modal-close');
  const overlay = document.getElementById('policy-overlay');

  if (!policyLink || !modal) return;

  policyLink.addEventListener('click', function (e) {
    e.preventDefault();
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay && overlay.classList.contains('active')) {
      closeModal();
    }
  });

  function closeModal() {
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/* ============================================================
   21. AUDIO PLAYER (simple toggle)
   ============================================================ */
let currentAudio = null;

function toggleAudio(btn, src) {
  const icon = btn.querySelector('.play-icon');

  if (currentAudio && !currentAudio.paused) {
    currentAudio.pause();
    document.querySelectorAll('.audio-play .play-icon').forEach(i => i.textContent = '▶');
    if (currentAudio.src.endsWith(src)) {
      currentAudio = null;
      return;
    }
  }

  currentAudio = new Audio(src || '');
  if (icon) icon.textContent = '⏸';
  showToast('Audio playback - Coming soon with actual audio files!', 'success');

  currentAudio.addEventListener('ended', function () {
    if (icon) icon.textContent = '▶';
  });

  currentAudio.addEventListener('error', function () {
    if (icon) icon.textContent = '▶';
  });
}

/* ============================================================
   22. PROGRESS BAR ANIMATIONS (Donations section)
   ============================================================ */
function initProgressBars() {
  const bars = document.querySelectorAll('.progress-fill');
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const width = entry.target.getAttribute('data-width') || '0';
        entry.target.style.width = width + '%';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => {
    bar.style.width = '0%';
    observer.observe(bar);
  });
}

document.addEventListener('DOMContentLoaded', initProgressBars);

/* ============================================================
   23. SMOOTH SCROLL FOR NAV LINKS
   ============================================================ */
document.addEventListener('click', function (e) {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const targetId = link.getAttribute('href');
  if (targetId === '#') return;

  const target = document.querySelector(targetId);
  if (target) {
    e.preventDefault();
    const headerHeight = document.getElementById('header')
      ? document.getElementById('header').offsetHeight
      : 80;
    const top = target.offsetTop - headerHeight;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }
});
