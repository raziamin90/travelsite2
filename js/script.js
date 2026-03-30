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
     4. NEWSLETTER FORM — basic validation
  ------------------------------------------ */
  const subscribeBtn = document.querySelector('.newsletter-section .btn-orange');

  if (subscribeBtn) {
    subscribeBtn.addEventListener('click', function () {
      const inputs = document.querySelectorAll('.newsletter-section .newsletter-input');
      let valid = true;

      inputs.forEach(function (input) {
        if (!input.value.trim()) {
          input.style.borderColor = '#e74c3c';
          valid = false;
        } else {
          input.style.borderColor = '#28a745';
        }
      });

      if (valid) {
        subscribeBtn.textContent = '✓ Subscribed!';
        subscribeBtn.style.backgroundColor = '#28a745';
        subscribeBtn.style.borderColor     = '#28a745';
        inputs.forEach(function (input) {
          input.value = '';
          input.style.borderColor = '#e5e5e5';
        });

        setTimeout(function () {
          subscribeBtn.innerHTML = '<i class="bi bi-send me-2"></i>Subscribe';
          subscribeBtn.style.backgroundColor = '';
          subscribeBtn.style.borderColor     = '';
        }, 3000);
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