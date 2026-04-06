/* =============================================
   HERO TRAVEL — contact.js
   Handles contact form validation + toast
============================================= */

document.addEventListener("DOMContentLoaded", function () {

  /* ============================================================
     NAVBAR SCROLL SHADOW (mirrors script.js)
  ============================================================ */
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    window.addEventListener("scroll", function () {
      navbar.classList.toggle("scrolled-nav", window.scrollY > 50);
    });
  }

  /* ============================================================
     MOBILE NAVBAR AUTO-CLOSE
  ============================================================ */
  document.querySelectorAll(".navbar-nav .nav-link").forEach(function (link) {
    link.addEventListener("click", function () {
      const navbarCollapse = document.getElementById("mainNav");
      if (navbarCollapse && navbarCollapse.classList.contains("show")) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse) bsCollapse.hide();
      }
    });
  });

  /* ============================================================
     SCROLL-TO-TOP BUTTON
  ============================================================ */
  const scrollTopBtn = document.createElement("button");
  scrollTopBtn.innerHTML = '<i class="bi bi-arrow-up"></i>';
  scrollTopBtn.setAttribute("aria-label", "Back to top");
  scrollTopBtn.style.cssText = `
    position:fixed; bottom:28px; right:28px;
    width:46px; height:46px; border-radius:50%;
    background:#FF5722; color:#fff; border:none;
    font-size:1.2rem; display:flex; align-items:center;
    justify-content:center; cursor:pointer;
    box-shadow:0 4px 16px rgba(255,87,34,.4);
    opacity:0; transform:translateY(20px);
    transition:opacity .3s ease,transform .3s ease;
    z-index:9990;
  `;
  document.body.appendChild(scrollTopBtn);

  window.addEventListener("scroll", function () {
    const visible = window.scrollY > 400;
    scrollTopBtn.style.opacity = visible ? "1" : "0";
    scrollTopBtn.style.transform = visible ? "translateY(0)" : "translateY(20px)";
    scrollTopBtn.style.pointerEvents = visible ? "auto" : "none";
  });
  scrollTopBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ============================================================
     TOAST SYSTEM (same as script.js)
  ============================================================ */
  // Inject styles only if not already present (script.js may have added them)
  if (!document.getElementById("ht-contact-toast-style")) {
    const s = document.createElement("style");
    s.id = "ht-contact-toast-style";
    s.textContent = `
      @keyframes htSlideIn  { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }
      @keyframes htSlideOut { from{opacity:1;transform:translateX(0)} to{opacity:0;transform:translateX(40px)} }
      @keyframes htShake {
        0%,100%{transform:translateX(0)}
        20%{transform:translateX(-6px)} 40%{transform:translateX(6px)}
        60%{transform:translateX(-4px)} 80%{transform:translateX(4px)}
      }
      #ht-toast-container {
        position:fixed; bottom:90px; right:24px;
        z-index:9999; display:flex; flex-direction:column; gap:10px;
      }
      .ht-toast {
        padding:13px 20px; border-radius:12px; color:#fff;
        font-size:.88rem; font-weight:500; font-family:'Poppins',sans-serif;
        box-shadow:0 6px 20px rgba(0,0,0,.18);
        display:flex; align-items:center; gap:10px;
        animation:htSlideIn .35s ease forwards; max-width:300px;
      }
      .ht-toast.success { background:#28a745; }
      .ht-toast.error   { background:#e74c3c; }
      .ht-toast.info    { background:#FF5722; }
      .ht-toast.fadeout { animation:htSlideOut .35s ease forwards; }
    `;
    document.head.appendChild(s);
  }

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
    toast.innerHTML = "<span>" + (icons[type] || "") + "</span><span>" + message + "</span>";
    toastContainer.appendChild(toast);
    setTimeout(function () {
      toast.classList.add("fadeout");
      toast.addEventListener("animationend", function () { toast.remove(); }, { once: true });
    }, duration);
  }

  /* ============================================================
     CONTACT FORM VALIDATION
  ============================================================ */
  const submitBtn = document.getElementById("cf-submit");
  const successBox = document.getElementById("cf-success");

  function shakeField(el) {
    el.style.animation = "htShake .4s ease";
    el.addEventListener("animationend", function () {
      el.style.animation = "";
    }, { once: true });
  }

  function validateField(el, checkFn) {
    const valid = checkFn(el.value);
    el.classList.toggle("is-error", !valid);
    el.classList.toggle("is-valid", valid);
    if (!valid) shakeField(el);
    return valid;
  }

  // Live validation — clear error on input
  ["cf-name", "cf-email", "cf-phone", "cf-subject", "cf-message"].forEach(function (id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("input", function () {
      el.classList.remove("is-error");
      if (el.value.trim()) el.classList.add("is-valid");
      else el.classList.remove("is-valid");
    });
  });

  if (submitBtn) {
    submitBtn.addEventListener("click", function () {
      const name    = document.getElementById("cf-name");
      const email   = document.getElementById("cf-email");
      const subject = document.getElementById("cf-subject");
      const message = document.getElementById("cf-message");

      let valid = true;

      if (!validateField(name, function (v) { return v.trim().length > 1; })) valid = false;
      if (!validateField(email, function (v) { return v.includes("@") && v.includes("."); })) valid = false;
      if (!validateField(subject, function (v) { return v !== ""; })) valid = false;
      if (!validateField(message, function (v) { return v.trim().length > 9; })) valid = false;

      if (!valid) {
        showToast("Please fill in all required fields.", "error");
        return;
      }

      // Success state
      submitBtn.innerHTML = '<i class="bi bi-check-lg me-2"></i>Message Sent!';
      submitBtn.style.background = "#28a745";
      submitBtn.style.borderColor = "#28a745";
      submitBtn.disabled = true;

      if (successBox) successBox.classList.remove("d-none");
      showToast("Message sent! We'll reply within 24 hours. ✉️", "success", 4000);

      // Reset after 4s
      setTimeout(function () {
        submitBtn.innerHTML = '<i class="bi bi-send-fill me-2"></i>Send Message';
        submitBtn.style.background = "";
        submitBtn.style.borderColor = "";
        submitBtn.disabled = false;
        if (successBox) successBox.classList.add("d-none");

        // Clear fields
        ["cf-name", "cf-email", "cf-phone", "cf-subject", "cf-message"].forEach(function (id) {
          const el = document.getElementById(id);
          if (el) {
            el.value = "";
            el.classList.remove("is-valid", "is-error");
          }
        });
      }, 4500);
    });
  }

  /* ============================================================
     SECTION FADE-IN ON SCROLL
  ============================================================ */
  if (!document.querySelector(".ht-fade")) {
    const fadeStyle = document.createElement("style");
    fadeStyle.textContent = `
      .ht-fade { opacity:0; transform:translateY(28px); transition:opacity .55s ease,transform .55s ease; }
      .ht-fade.ht-visible { opacity:1; transform:translateY(0); }
    `;
    document.head.appendChild(fadeStyle);
  }

  document.querySelectorAll(
    ".contact-info-card, .contact-form-box, .contact-accordion-item, .map-wrapper"
  ).forEach(function (el, i) {
    el.classList.add("ht-fade");
    el.style.transitionDelay = (i % 4) * 0.08 + "s";
  });

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("ht-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".ht-fade").forEach(function (el) {
    observer.observe(el);
  });

});