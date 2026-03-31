/* =============================================
   HERO TRAVEL — script.js
============================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ------------------------------------------
     1. STICKY NAVBAR — add shadow on scroll
  ------------------------------------------ */
  const navbar = document.querySelector('.navbar');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled-nav');
    } else {
      navbar.classList.remove('scrolled-nav');
    }
  });


  /* ------------------------------------------
     2. SMOOTH ACTIVE LINK HIGHLIGHT
        Updates the active nav link based on
        which section is in view.
  ------------------------------------------ */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

  function setActiveLink () {
    let currentId = '';
    sections.forEach(function (section) {
      const sectionTop    = section.getBoundingClientRect().top;
      const sectionHeight = section.offsetHeight;
      if (sectionTop <= 80 && sectionTop + sectionHeight > 80) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + currentId) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', setActiveLink);


  /* ------------------------------------------
     3. CLOSE MOBILE NAVBAR ON LINK CLICK
  ------------------------------------------ */
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      const navbarCollapse = document.getElementById('mainNav');
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse) bsCollapse.hide();
      }
    });
  });


/* ------------------------------------------
   4. NEWSLETTER — Region Carousel + Validation
------------------------------------------ */

const regionData = {
  global: [
    'Subscribe to get exclusive deals, travel tips, and our latest tour packages delivered straight to your inbox.',
    'Get worldwide travel deals delivered to your inbox.',
    'Discover featured destinations from every corner of the globe.',
    'Be first to hear about our latest tour packages.',
    'Exclusive travel tips from our expert guides.'
  ],
  asia:       [
    'Exclusive deals for Maldives, Bali, and Kashmir.',
    'Discover stunning beaches across Southeast Asia.',
    'Hidden gems in Bangladesh, Sri Lanka, and beyond.',
    'Best time-to-visit guides for Asian destinations.'
  ],
  europe:     [
    'Best European getaways — Santorini, Paris, Amalfi.',
    'Seasonal deals on Mediterranean cruises and tours.',
    'Explore ancient cities and breathtaking coastlines.',
    'Hand-picked boutique hotels across Europe.'
  ],
  americas:   [
    'Discover hidden gems from the Rockies to Patagonia.',
    'Adventure tours across North & South America.',
    'Best national parks and road trip routes.',
    'Exclusive deals on Caribbean island escapes.'
  ],
  middleeast: [
    'Luxurious desert escapes and ancient city tours.',
    'Breathtaking architecture and cultural experiences.',
    'Best deals on Dubai, Jordan, and Oman packages.',
    'Exclusive Ramadan and seasonal travel offers.'
  ],
  africa:     [
    'Safari adventures across the African continent.',
    'Coastal escapes and cultural experiences in Africa.',
    'Best wildlife parks and conservation tour deals.',
    'Discover Morocco, Kenya, Tanzania, and more.'
  ]
};

const regionSelect   = document.getElementById('regionSelect');
const selectedInput  = document.getElementById('selectedRegion');
const subscribeBtn   = document.getElementById('subscribeBtn');
const nlName         = document.getElementById('nlName');
const nlEmail        = document.getElementById('nlEmail');
const confirmBox     = document.querySelector('.subscribe-confirm');
const confirmMsg     = document.getElementById('confirmMsg');
const carouselEl     = document.querySelector('.newsletter-carousel-text');

let carouselIndex    = 0;
let carouselRegion   = 'global';
let carouselInterval = null;

function showCarouselText(region, index) {
  if (!carouselEl) return;
  const texts = regionData[region] || regionData['global'];
  carouselEl.style.opacity = '0';
  setTimeout(function () {
    carouselEl.textContent   = texts[index % texts.length];
    carouselEl.style.opacity = '1';
  }, 300);
}

function startCarousel(region) {
  carouselRegion = region;
  carouselIndex  = 0;
  if (carouselInterval) clearInterval(carouselInterval);
  showCarouselText(carouselRegion, carouselIndex);
  carouselInterval = setInterval(function () {
    carouselIndex++;
    showCarouselText(carouselRegion, carouselIndex);
  }, 3000);
}

// Start on load with global
startCarousel('global');

// Update on region change
if (regionSelect) {
  regionSelect.addEventListener('change', function () {
    const region = regionSelect.value;
    if (selectedInput) selectedInput.value = region;
    carouselIndex = 0;
    startCarousel(region);
  });
}

// Subscribe validation
if (subscribeBtn) {
  subscribeBtn.addEventListener('click', function () {
    let valid = true;

    if (!nlName || !nlName.value.trim()) {
      if (nlName) nlName.style.borderColor = '#e74c3c';
      valid = false;
    } else {
      nlName.style.borderColor = '#28a745';
    }

    if (!nlEmail || !nlEmail.value.trim() || !nlEmail.value.includes('@')) {
      if (nlEmail) nlEmail.style.borderColor = '#e74c3c';
      valid = false;
    } else {
      nlEmail.style.borderColor = '#28a745';
    }

    if (valid) {
      const regionLabels = { global:'Global', asia:'Asia', europe:'Europe', americas:'Americas', middleeast:'Middle East', africa:'Africa' };
      const label = regionLabels[carouselRegion] || 'Global';

      subscribeBtn.innerHTML             = '<i class="bi bi-check-lg me-2"></i>Subscribed!';
      subscribeBtn.style.backgroundColor = '#28a745';
      subscribeBtn.style.borderColor     = '#28a745';
      subscribeBtn.style.color           = '#fff';

      if (confirmMsg) confirmMsg.textContent = 'You\'re subscribed to the ' + label + ' newsletter!';
      if (confirmBox) confirmBox.classList.remove('d-none');

      nlName.value  = '';
      nlEmail.value = '';
      nlName.style.borderColor  = '#e5e5e5';
      nlEmail.style.borderColor = '#e5e5e5';

      setTimeout(function () {
        subscribeBtn.innerHTML = '<img src="assests/images/logo.svg" alt="" class="subscribe-logo me-2" style="width:16px; height:16px; vertical-align:-2px;" /> Subscribe';
        subscribeBtn.style.backgroundColor = '';
        subscribeBtn.style.borderColor     = '';
        subscribeBtn.style.color           = '';
        if (confirmBox) confirmBox.classList.add('d-none');
      }, 4000);
    }
  });
}

  /* ------------------------------------------
     5. DESTINATION CARD — simple ripple hint
        (adds a CSS class on hover for browsers
         that support :has or we do it in JS)
  ------------------------------------------ */
  const destCards = document.querySelectorAll('.dest-card');
  destCards.forEach(function (card) {
    card.addEventListener('mouseenter', function () {
      card.style.cursor = 'pointer';
    });
  });

});