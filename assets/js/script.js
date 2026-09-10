/**
 * MANGATTIDOM SERVICE CO-OPERATIVE BANK
 * Main JavaScript File - Accessible Navigation, Gallery Lightbox, and Contact Form
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initLightbox();
  initContactForm();
});

/* ==========================================================================
   NAVIGATION & MOBILE MENU
   ========================================================================== */
function initNavigation() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navDropdown = document.querySelector('.nav-dropdown');
  const dropdownToggle = document.querySelector('.dropdown-toggle');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // Mobile dropdown expansion
  if (dropdownToggle && navDropdown) {
    dropdownToggle.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        e.stopPropagation();
        navDropdown.classList.toggle('is-mobile-open');
      }
    });
  }

  // Close menus when clicking outside
  document.addEventListener('click', (e) => {
    if (navMenu && navMenu.classList.contains('is-open')) {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navMenu.classList.remove('is-open');
        if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
      }
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (navMenu && navMenu.classList.contains('is-open')) {
        navMenu.classList.remove('is-open');
        if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
      }
      if (navDropdown) {
        navDropdown.classList.remove('is-mobile-open');
      }
    }
  });
}

/* ==========================================================================
   INTERACTIVE GALLERY LIGHTBOX
   ========================================================================== */
function initLightbox() {
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  const lightbox = document.getElementById('lightboxModal');
  if (!galleryItems.length || !lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxCounter = lightbox.querySelector('.lightbox-counter');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  let currentIndex = 0;

  function showImage(index) {
    if (index < 0) index = galleryItems.length - 1;
    if (index >= galleryItems.length) index = 0;
    currentIndex = index;

    const item = galleryItems[currentIndex];
    const imgSrc = item.getAttribute('data-full') || item.querySelector('img').src;
    const imgAlt = item.querySelector('img').alt || 'Gallery photo';

    lightboxImg.src = imgSrc;
    lightboxImg.alt = imgAlt;
    if (lightboxCounter) {
      lightboxCounter.textContent = `${currentIndex + 1} / ${galleryItems.length}`;
    }
  }

  function openLightbox(index) {
    showImage(index);
    lightbox.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(index);
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showImage(currentIndex - 1); });
  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showImage(currentIndex + 1); });

  // Backdrop click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
  });

  // Touch Swipe Support for Mobile
  let touchStartX = 0;
  let touchEndX = 0;

  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        showImage(currentIndex - 1); // Swiped right -> previous
      } else {
        showImage(currentIndex + 1); // Swiped left -> next
      }
    }
  }
}

/* ==========================================================================
   CONTACT FORM (STATIC / MAILTO FALLBACK)
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('bankEnquiryForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('[name="name"]')?.value.trim() || '';
    const phone = form.querySelector('[name="phone"]')?.value.trim() || '';
    const service = form.querySelector('[name="service"]')?.value || 'General Banking Enquiry';
    const message = form.querySelector('[name="message"]')?.value.trim() || '';

    if (!name || !phone) {
      alert('Please provide your name and phone number so our bank team can reach you.');
      return;
    }

    const subject = encodeURIComponent(`Banking Enquiry - ${service} (${name})`);
    const body = encodeURIComponent(
      `Dear Mangattidom Service Co-operative Bank Team,\n\n` +
      `I would like to enquire about: ${service}\n\n` +
      `Contact Details:\n` +
      `Name: ${name}\n` +
      `Phone: ${phone}\n\n` +
      `Message:\n${message}\n\n` +
      `Thank you.`
    );

    // Open user's default email client
    window.location.href = `mailto:mangattidom@gmail.com?subject=${subject}&body=${body}`;

    // Display confirmation message in UI
    const statusBox = document.getElementById('formStatus');
    if (statusBox) {
      statusBox.innerHTML = `
        <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; padding: 1rem; border-radius: 8px; margin-top: 1rem;">
          <strong>Thank you, ${name}!</strong> Your enquiry has been prepared. If your email application did not open automatically, you can also call us directly at <strong>0490 2308568</strong> or email <strong>mangattidom@gmail.com</strong>.
        </div>
      `;
    }
  });
}
