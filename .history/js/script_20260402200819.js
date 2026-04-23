/* =============================================
   HERO TRAVEL — script.js  (upgraded)
============================================= */

document.addEventListener("DOMContentLoaded", function () {
  /* ============================================================
     1. STICKY NAVBAR — add shadow on scroll
  ============================================================ */
  const navbar = document.querySelector(".navbar");

  window.addEventListener("scroll", function () {
    navbar.classList.toggle("scrolled-nav", window.scrollY > 50);
  });

  /* ============================================================
     2. SMOOTH ACTIVE LINK HIGHLIGHT
  ============================================================ */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

  function setActiveLink() {
    let currentId = "";
    sections.forEach(function (section) {
      const top = section.getBoundingClientRect().top;
      if (top <= 80 && top + section.offsetHeight > 80) {
        currentId = section.getAttribute("id");
      }
    });
    navLinks.forEach(function (link) {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + currentId)
        link.classList.add("active");
    });
  }
  window.addEventListener("scroll", setActiveLink);

  /* ============================================================
     3. CLOSE MOBILE NAVBAR ON LINK CLICK
  ============================================================ */
  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      const navbarCollapse = document.getElementById("mainNav");
      if (navbarCollapse && navbarCollapse.classList.contains("show")) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse) bsCollapse.hide();
      }
    });
  });

  /* ============================================================
     4. NEWSLETTER — Region Carousel + Validation
  ============================================================ */
  const regionData = {
    global: [
      "Subscribe to get exclusive deals, travel tips, and our latest tour packages delivered straight to your inbox.",
      "Get worldwide travel deals delivered to your inbox.",
      "Discover featured destinations from every corner of the globe.",
      "Be first to hear about our latest tour packages.",
      "Exclusive travel tips from our expert guides.",
    ],
    asia: [
      "Exclusive deals for Maldives, Bali, and Kashmir.",
      "Discover stunning beaches across Southeast Asia.",
      "Hidden gems in Bangladesh, Sri Lanka, and beyond.",
      "Best time-to-visit guides for Asian destinations.",
    ],
    europe: [
      "Best European getaways — Santorini, Paris, Amalfi.",
      "Seasonal deals on Mediterranean cruises and tours.",
      "Explore ancient cities and breathtaking coastlines.",
      "Hand-picked boutique hotels across Europe.",
    ],
    americas: [
      "Discover hidden gems from the Rockies to Patagonia.",
      "Adventure tours across North & South America.",
      "Best national parks and road trip routes.",
      "Exclusive deals on Caribbean island escapes.",
    ],
    middleeast: [
      "Luxurious desert escapes and ancient city tours.",
      "Breathtaking architecture and cultural experiences.",
      "Best deals on Dubai, Jordan, and Oman packages.",
      "Exclusive Ramadan and seasonal travel offers.",
    ],
    africa: [
      "Safari adventures across the African continent.",
      "Coastal escapes and cultural experiences in Africa.",
      "Best wildlife parks and conservation tour deals.",
      "Discover Morocco, Kenya, Tanzania, and more.",
    ],
  };

  const regionSelect = document.getElementById("regionSelect");
  const selectedInput = document.getElementById("selectedRegion");
  const subscribeBtn = document.getElementById("subscribeBtn");
  const nlName = document.getElementById("nlName");
  const nlEmail = document.getElementById("nlEmail");
  const confirmBox = document.querySelector(".subscribe-confirm");
  const confirmMsg = document.getElementById("confirmMsg");
  const carouselEl = document.querySelector(".newsletter-carousel-text");

  let carouselIndex = 0,
    carouselRegion = "global",
    carouselInterval = null;

  function showCarouselText(region, index) {
    if (!carouselEl) return;
    const texts = regionData[region] || regionData["global"];
    carouselEl.style.opacity = "0";
    setTimeout(function () {
      carouselEl.textContent = texts[index % texts.length];
      carouselEl.style.opacity = "1";
    }, 300);
  }

  function startCarousel(region) {
    carouselRegion = region;
    carouselIndex = 0;
    if (carouselInterval) clearInterval(carouselInterval);
    showCarouselText(carouselRegion, carouselIndex);
    carouselInterval = setInterval(function () {
      carouselIndex++;
      showCarouselText(carouselRegion, carouselIndex);
    }, 3000);
  }

  startCarousel("global");

  if (regionSelect) {
    regionSelect.addEventListener("change", function () {
      const region = regionSelect.value;
      if (selectedInput) selectedInput.value = region;
      startCarousel(region);
    });
  }

  if (subscribeBtn) {
    subscribeBtn.addEventListener("click", function () {
      let valid = true;
      if (!nlName || !nlName.value.trim()) {
        if (nlName) nlName.style.borderColor = "#e74c3c";
        valid = false;
      } else {
        nlName.style.borderColor = "#28a745";
      }
      if (!nlEmail || !nlEmail.value.trim() || !nlEmail.value.includes("@")) {
        if (nlEmail) nlEmail.style.borderColor = "#e74c3c";
        valid = false;
      } else {
        nlEmail.style.borderColor = "#28a745";
      }

      if (valid) {
        const regionLabels = {
          global: "Global",
          asia: "Asia",
          europe: "Europe",
          americas: "Americas",
          middleeast: "Middle East",
          africa: "Africa",
        };
        subscribeBtn.innerHTML =
          '<i class="bi bi-check-lg me-2"></i>Subscribed!';
        subscribeBtn.style.cssText =
          "background-color:#28a745;border-color:#28a745;color:#fff;";
        if (confirmMsg)
          confirmMsg.textContent =
            "You're subscribed to the " +
            (regionLabels[carouselRegion] || "Global") +
            " newsletter!";
        if (confirmBox) confirmBox.classList.remove("d-none");
        nlName.value = "";
        nlEmail.value = "";
        nlName.style.borderColor = "#e5e5e5";
        nlEmail.style.borderColor = "#e5e5e5";
        setTimeout(function () {
          subscribeBtn.innerHTML =
            '<img src="assets/images/logo.svg" alt="" class="subscribe-logo me-2" style="width:16px;height:16px;vertical-align:-2px;" /> Subscribe';
          subscribeBtn.style.cssText = "";
          if (confirmBox) confirmBox.classList.add("d-none");
        }, 4000);
      }
    });
  }

  /* ============================================================
     5. DESTINATION CARD CURSOR
  ============================================================ */
  document.querySelectorAll(".dest-card").forEach(function (card) {
    card.style.cursor = "pointer";
  });

  /* ============================================================
     6. SCROLL-TO-TOP BUTTON  ← NEW
  ============================================================ */
  const scrollTopBtn = document.createElement("button");
  scrollTopBtn.id = "scrollTopBtn";
  scrollTopBtn.innerHTML = '<i class="bi bi-arrow-up"></i>';
  scrollTopBtn.setAttribute("aria-label", "Back to top");
  scrollTopBtn.style.cssText = `
    position: fixed;
    bottom: 28px;
    right: 28px;
    width: 46px;
    height: 46px;
    border-radius: 50%;
    background: #FF5722;
    color: #fff;
    border: none;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 16px rgba(255,87,34,.4);
    opacity: 0;
    transform: translateY(20px);
    transition: opacity .3s ease, transform .3s ease;
    z-index: 9990;
  `;
  document.body.appendChild(scrollTopBtn);

  window.addEventListener("scroll", function () {
    const visible = window.scrollY > 400;
    scrollTopBtn.style.opacity = visible ? "1" : "0";
    scrollTopBtn.style.transform = visible
      ? "translateY(0)"
      : "translateY(20px)";
    scrollTopBtn.style.pointerEvents = visible ? "auto" : "none";
  });

  scrollTopBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ============================================================
     7. SEARCH BAR VALIDATION  ← NEW
  ============================================================ */
  const searchBtn = document.querySelector(".btn-search");
  if (searchBtn) {
    searchBtn.addEventListener("click", function () {
      const selects = document.querySelectorAll(
        ".hero-search-bar .search-select",
      );
      let allFilled = true;

      selects.forEach(function (sel) {
        if (!sel.value || sel.selectedIndex === 0) {
          // shake + red border
          sel.style.borderColor = "#e74c3c";
          sel.style.animation = "htShake .4s ease";
          sel.addEventListener(
            "animationend",
            function () {
              sel.style.animation = "";
            },
            { once: true },
          );
          allFilled = false;
        } else {
          sel.style.borderColor = "#28a745";
        }
      });

      if (allFilled) {
        // Success toast
        showToast("🔍 Searching for your perfect trip…", "success");
        // Reset borders after a moment
        setTimeout(function () {
          selects.forEach(function (sel) {
            sel.style.borderColor = "";
          });
        }, 2000);
      } else {
        showToast("Please fill in all search fields.", "error");
      }
    });
  }

  // Inject shake keyframe once
  const shakeStyle = document.createElement("style");
  shakeStyle.textContent = `
    @keyframes htShake {
      0%,100% { transform: translateX(0); }
      20%      { transform: translateX(-6px); }
      40%      { transform: translateX(6px); }
      60%      { transform: translateX(-4px); }
      80%      { transform: translateX(4px); }
    }
    @keyframes htSlideIn {
      from { opacity:0; transform:translateX(40px); }
      to   { opacity:1; transform:translateX(0); }
    }
    @keyframes htSlideOut {
      from { opacity:1; transform:translateX(0); }
      to   { opacity:0; transform:translateX(40px); }
    }
    /* Destination modal backdrop */
    .ht-modal-backdrop {
      position:fixed; inset:0; background:rgba(0,0,0,.7);
      z-index:10000; display:flex; align-items:center;
      justify-content:center; padding:20px;
      animation: htFadeIn .25s ease;
    }
    @keyframes htFadeIn  { from{opacity:0} to{opacity:1} }
    @keyframes htFadeOut { from{opacity:1} to{opacity:0} }
    .ht-modal {
      background:#fff; border-radius:20px; overflow:hidden;
      max-width:560px; width:100%;
      animation: htSlideUp .3s ease;
      position:relative;
    }
    @keyframes htSlideUp {
      from{opacity:0;transform:translateY(30px)}
      to  {opacity:1;transform:translateY(0)}
    }
    .ht-modal-img { width:100%; height:240px; object-fit:cover; }
    .ht-modal-body { padding:28px; }
    .ht-modal-close {
      position:absolute; top:14px; right:16px;
      background:rgba(0,0,0,.45); border:none; color:#fff;
      width:34px; height:34px; border-radius:50%;
      font-size:1rem; cursor:pointer; display:flex;
      align-items:center; justify-content:center;
      transition:background .2s;
    }
    .ht-modal-close:hover { background:rgba(255,87,34,.85); }

    /* Booking form modal */
    .ht-book-modal {
      background:#fff; border-radius:20px; overflow:hidden;
      max-width:480px; width:100%; padding:36px;
      animation: htSlideUp .3s ease; position:relative;
    }
    .ht-book-modal input,
    .ht-book-modal select {
      display:block; width:100%; margin-bottom:14px;
      border:1.5px solid #e5e5e5; border-radius:10px;
      padding:11px 16px; font-family:'Poppins',sans-serif;
      font-size:.9rem; color:#1a1a2e;
      transition:border-color .2s;
    }
    .ht-book-modal input:focus,
    .ht-book-modal select:focus {
      border-color:#FF5722;
      outline:none;
      box-shadow:0 0 0 3px rgba(255,87,34,.1);
    }
    .ht-book-modal input.ht-error { border-color:#e74c3c !important; }
    .ht-book-modal label {
      display:block; font-size:.82rem; font-weight:600;
      color:#555; margin-bottom:4px;
    }
    /* Toast */
    #ht-toast-container {
      position:fixed; bottom:90px; right:24px;
      z-index:9999; display:flex; flex-direction:column; gap:10px;
    }
    .ht-toast {
      padding:13px 20px; border-radius:12px; color:#fff;
      font-size:.88rem; font-weight:500; font-family:'Poppins',sans-serif;
      box-shadow:0 6px 20px rgba(0,0,0,.18);
      display:flex; align-items:center; gap:10px;
      animation: htSlideIn .35s ease forwards;
      max-width:300px;
    }
    .ht-toast.success { background:#28a745; }
    .ht-toast.error   { background:#e74c3c; }
    .ht-toast.info    { background:#FF5722; }
    .ht-toast.fadeout { animation: htSlideOut .35s ease forwards; }
  `;
  document.head.appendChild(shakeStyle);

  /* ============================================================
     8. TOAST HELPER  ← NEW
  ============================================================ */
  let toastContainer = document.getElementById("ht-toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "ht-toast-container";
    document.body.appendChild(toastContainer);
  }

  function showToast(message, type, duration) {
    type = type || "info";
    duration = duration || 3200;
    const icons = { success: "✅", error: "❌", info: "✈️" };
    const toast = document.createElement("div");
    toast.className = "ht-toast " + type;
    toast.innerHTML =
      "<span>" + (icons[type] || "") + "</span><span>" + message + "</span>";
    toastContainer.appendChild(toast);
    setTimeout(function () {
      toast.classList.add("fadeout");
      toast.addEventListener(
        "animationend",
        function () {
          toast.remove();
        },
        { once: true },
      );
    }, duration);
  }

  /* ============================================================
     9. DESTINATION CARD MODAL  ← NEW
  ============================================================ */
  const destInfo = {
    Maldives: {
      emoji: "🏝️",
      desc: "Crystal-clear turquoise lagoons, overwater bungalows, and some of the finest coral reefs on the planet. The Maldives is the ultimate tropical escape.",
      highlights: [
        "World-class snorkelling & diving",
        "Private island resorts",
        "Stunning sunset cruises",
      ],
      price: "From $1,200 / person",
    },
    Indonesia: {
      emoji: "🌋",
      desc: "From the terraced rice paddies of Bali to the ancient temples of Java, Indonesia offers an extraordinary blend of culture, nature, and adventure.",
      highlights: [
        "Ancient temple complexes",
        "Lush tropical rainforests",
        "Vibrant local markets",
      ],
      price: "From $850 / person",
    },
    "Sri Lanka": {
      emoji: "🌿",
      desc: "A teardrop-shaped island packed with UNESCO World Heritage Sites, pristine beaches, misty highlands, and warm, welcoming locals.",
      highlights: [
        "Elephant safari at Minneriya",
        "Train ride through tea country",
        "Surfing at Arugam Bay",
      ],
      price: "From $780 / person",
    },
    "North America": {
      emoji: "🏔️",
      desc: "From the dramatic peaks of the Rockies to the neon glow of Times Square, North America delivers bucket-list experiences at every turn.",
      highlights: [
        "Grand Canyon & Yellowstone",
        "Road trips on Route 66",
        "Vibrant multicultural cities",
      ],
      price: "From $1,400 / person",
    },
    Kashmir: {
      emoji: "❄️",
      desc: 'Often called "Paradise on Earth", Kashmir enchants visitors with its snow-capped Himalayan peaks, shikara rides on Dal Lake, and fragrant saffron fields.',
      highlights: [
        "Shikara ride on Dal Lake",
        "Skiing in Gulmarg",
        "Mughal garden tours",
      ],
      price: "From $650 / person",
    },
    Bangladesh: {
      emoji: "🐯",
      desc: "Home to the Sundarbans mangrove forest, the longest natural sea beach at Cox's Bazar, and rich Bengali culture stretching back millennia.",
      highlights: [
        "World's longest sea beach",
        "Sundarbans tiger reserve",
        "Magnificent river delta",
      ],
      price: "From $420 / person",
    },
    Bandarban: {
      emoji: "⛰️",
      desc: "Nestled in the Chittagong Hill Tracts, Bandarban is Bangladesh's most mountainous district — a land of tribal culture, mist-wrapped peaks, and hidden waterfalls.",
      highlights: [
        "Boga Lake trekking",
        "Nilgiri & Nilachal viewpoints",
        "Indigenous village homestays",
      ],
      price: "From $180 / person",
    },
  };

  function openDestModal(name, imgSrc) {
    const info = destInfo[name] || {
      emoji: "📍",
      desc: "A wonderful destination awaiting your discovery.",
      highlights: [],
      price: "Contact us for pricing",
    };

    const backdrop = document.createElement("div");
    backdrop.className = "ht-modal-backdrop";

    const highlightsHTML = info.highlights
      .map(function (h) {
        return (
          '<li style="margin-bottom:6px;font-size:.88rem;color:#444;"><i class="bi bi-check-circle-fill" style="color:#FF5722;margin-right:7px;"></i>' +
          h +
          "</li>"
        );
      })
      .join("");

    backdrop.innerHTML = `
      <div class="ht-modal">
        <img src="${imgSrc}" alt="${name}" class="ht-modal-img" onerror="this.style.display='none'" />
        <button class="ht-modal-close" aria-label="Close">&times;</button>
        <div class="ht-modal-body">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
            <span style="font-size:2rem;">${info.emoji}</span>
            <h3 style="margin:0;font-weight:700;color:#1a1a2e;">${name}</h3>
          </div>
          <p style="color:#6c757d;font-size:.92rem;line-height:1.7;margin-bottom:16px;">${info.desc}</p>
          <ul style="list-style:none;padding:0;margin-bottom:20px;">${highlightsHTML}</ul>
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
            <span style="font-size:1.05rem;font-weight:700;color:#FF5722;">${info.price}</span>
            <button class="btn-book-now btn" data-dest="${name}"
              style="background:#FF5722;color:#fff;border:none;border-radius:8px;
                     padding:10px 24px;font-weight:600;font-family:'Poppins',sans-serif;
                     cursor:pointer;font-size:.9rem;transition:background .2s;">
              Book Now
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);
    document.body.style.overflow = "hidden";

    // Close handlers
    backdrop
      .querySelector(".ht-modal-close")
      .addEventListener("click", function () {
        closeModal(backdrop);
      });
    backdrop.addEventListener("click", function (e) {
      if (e.target === backdrop) closeModal(backdrop);
    });

    // Book Now inside dest modal opens booking modal
    backdrop
      .querySelector(".btn-book-now")
      .addEventListener("click", function () {
        closeModal(backdrop);
        openBookingModal(name);
      });
  }

  function closeModal(el) {
    el.style.animation = "htFadeOut .25s ease forwards";
    el.addEventListener(
      "animationend",
      function () {
        el.remove();
        document.body.style.overflow = "";
      },
      { once: true },
    );
  }

  // Attach click listeners to destination cards
  document.querySelectorAll(".dest-card").forEach(function (card) {
    card.addEventListener("click", function () {
      const nameEl = card.querySelector(".dest-name");
      const imgEl = card.querySelector(".dest-img");
      if (nameEl && imgEl) openDestModal(nameEl.textContent.trim(), imgEl.src);
    });
  });

  /* ============================================================
    10. BOOKING FORM MODAL  ← NEW
        Triggered by "Book Now" in deal cards AND dest modals
  ============================================================ */
  function openBookingModal(presetDestination) {
    presetDestination = presetDestination || "";

    const backdrop = document.createElement("div");
    backdrop.className = "ht-modal-backdrop";

    const destOptions = [
      "Maldives",
      "Indonesia",
      "Sri Lanka",
      "North America",
      "Kashmir",
      "Bangladesh",
      "Bandarban",
      "Santorini",
      "Bali",
    ]
      .map(function (d) {
        return (
          '<option value="' +
          d +
          '"' +
          (d === presetDestination ? " selected" : "") +
          ">" +
          d +
          "</option>"
        );
      })
      .join("");

    backdrop.innerHTML = `
      <div class="ht-book-modal">
        <button class="ht-modal-close" aria-label="Close">&times;</button>
        <div style="margin-bottom:22px;">
          <span style="background:#fff3ef;color:#FF5722;font-size:.75rem;font-weight:600;
                       letter-spacing:.07em;text-transform:uppercase;padding:4px 12px;
                       border-radius:50px;display:inline-block;">Book Your Trip</span>
          <h3 style="margin:8px 0 2px;font-weight:700;font-size:1.3rem;color:#1a1a2e;">Reserve Your Spot</h3>
          <p style="color:#6c757d;font-size:.85rem;margin:0;">Fill in your details and we'll get back to you within 24 hours.</p>
        </div>

        <label>Full Name</label>
        <input type="text" id="bk-name" placeholder="e.g. Tanvir Ahmed" />

        <label>Email Address</label>
        <input type="email" id="bk-email" placeholder="you@example.com" />

        <label>Phone Number</label>
        <input type="tel" id="bk-phone" placeholder="+880 1XXX-XXXXXX" />

        <label>Destination</label>
        <select id="bk-dest">
          <option value="" disabled ${!presetDestination ? "selected" : ""}>Select destination</option>
          ${destOptions}
        </select>

        <label>Travel Date</label>
        <input type="date" id="bk-date" min="${new Date().toISOString().split("T")[0]}" />

        <label>Number of Travellers</label>
        <input type="number" id="bk-pax" placeholder="e.g. 2" min="1" max="20" />

        <button id="bk-submit"
          style="width:100%;background:#FF5722;color:#fff;border:none;border-radius:10px;
                 padding:13px;font-weight:700;font-size:.95rem;font-family:'Poppins',sans-serif;
                 cursor:pointer;transition:background .2s;margin-top:4px;">
          Confirm Booking Request
        </button>
        <div id="bk-confirm" style="display:none;text-align:center;margin-top:16px;
             color:#28a745;font-weight:600;font-size:.9rem;">
          <i class="bi bi-check-circle-fill"></i> Booking request sent! We'll contact you soon.
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);
    document.body.style.overflow = "hidden";

    // Close
    backdrop
      .querySelector(".ht-modal-close")
      .addEventListener("click", function () {
        closeModal(backdrop);
      });
    backdrop.addEventListener("click", function (e) {
      if (e.target === backdrop) closeModal(backdrop);
    });

    // Submit
    backdrop.querySelector("#bk-submit").addEventListener("click", function () {
      const fields = [
        {
          id: "bk-name",
          check: function (v) {
            return v.trim().length > 1;
          },
        },
        {
          id: "bk-email",
          check: function (v) {
            return v.includes("@") && v.includes(".");
          },
        },
        {
          id: "bk-phone",
          check: function (v) {
            return v.trim().length > 5;
          },
        },
        {
          id: "bk-dest",
          check: function (v) {
            return v !== "";
          },
        },
        {
          id: "bk-date",
          check: function (v) {
            return v !== "";
          },
        },
        {
          id: "bk-pax",
          check: function (v) {
            return parseInt(v) > 0;
          },
        },
      ];

      let valid = true;
      fields.forEach(function (f) {
        const el = backdrop.querySelector("#" + f.id);
        if (!el) return;
        if (!f.check(el.value)) {
          el.classList.add("ht-error");
          el.style.animation = "htShake .4s ease";
          el.addEventListener(
            "animationend",
            function () {
              el.style.animation = "";
            },
            { once: true },
          );
          valid = false;
        } else {
          el.classList.remove("ht-error");
          el.style.borderColor = "#28a745";
        }
      });

      if (valid) {
        const dest = backdrop.querySelector("#bk-dest").value;
        backdrop.querySelector("#bk-submit").innerHTML =
          '<i class="bi bi-check-lg me-1"></i> Sent!';
        backdrop.querySelector("#bk-submit").style.background = "#28a745";
        backdrop.querySelector("#bk-confirm").style.display = "block";
        showToast(
          "✈️ Booking request for " + dest + " received!",
          "success",
          4000,
        );
        setTimeout(function () {
          closeModal(backdrop);
        }, 3000);
      }
    });
  }

  // Attach to all "Book Now" buttons in deal cards
  document.querySelectorAll(".deal-card .btn-orange").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const destEl = btn.closest(".deal-overlay-card").querySelector("h4");
      const dest = destEl
        ? destEl.textContent.replace("Tour To ", "").trim()
        : "";
      openBookingModal(dest);
    });
  });

  /* ============================================================
    11. SMOOTH SCROLL for all anchor links  ← NEW
  ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        const offset = 75; // navbar height
        const top =
          target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: "smooth" });
      }
    });
  });

  /* ============================================================
    12. SECTION FADE-IN ON SCROLL  ← NEW (lightweight)
  ============================================================ */
  const fadeStyle = document.createElement("style");
  fadeStyle.textContent = `
    .ht-fade { opacity:0; transform:translateY(28px); transition:opacity .55s ease, transform .55s ease; }
    .ht-fade.ht-visible { opacity:1; transform:translateY(0); }
  `;
  document.head.appendChild(fadeStyle);

  // Apply to section children
  document
    .querySelectorAll(
      ".section-padding > .container > .row, .section-padding > .container > .text-center",
    )
    .forEach(function (el, i) {
      el.classList.add("ht-fade");
      el.style.transitionDelay = (i % 3) * 0.08 + "s";
    });

  const fadeObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("ht-visible");
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  document.querySelectorAll(".ht-fade").forEach(function (el) {
    fadeObserver.observe(el);
  });

  /* ============================================================
    13. DEAL CARD "See All Packages" — scroll to deals  ← NEW
  ============================================================ */
  document.querySelectorAll('a[href="#"]').forEach(function (link) {
    if (link.textContent.trim() === "See All Packages") {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        showToast(
          "All packages coming soon! Subscribe for early access.",
          "info",
          3500,
        );
      });
    }
  });

  /* ============================================================
    14. NAVBAR "Read More" / "See More" links — toast  ← NEW
  ============================================================ */
  document.querySelectorAll(".btn-outline-orange").forEach(function (btn) {
    if (btn.textContent.trim() === "See More") {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        showToast("More adventures coming soon — stay tuned! 🌏", "info", 3200);
      });
    }
  });
}); // END DOMContentLoaded
//
