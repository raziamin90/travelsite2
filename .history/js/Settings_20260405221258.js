/* =============================================
   HERO TRAVEL — settings.js
   Handles: Profile, Theme, Notifications,
            Security, Sidebar navigation
============================================= */

document.addEventListener("DOMContentLoaded", function () {

  /* ============================================================
     HELPER — show a toast using the shared showToast()
     from script.js. Falls back to alert if not loaded.
  ============================================================ */
  function toast(msg, type) {
    if (typeof showToast === "function") {
      showToast(msg, type || "info", 3200);
    } else {
      // Fallback: inject a minimal toast if script.js hasn't loaded
      var t = document.createElement("div");
      t.style.cssText = "position:fixed;bottom:90px;right:24px;background:#FF5722;color:#fff;" +
        "padding:13px 20px;border-radius:12px;font-family:'Poppins',sans-serif;" +
        "font-size:.88rem;z-index:9999;box-shadow:0 6px 20px rgba(0,0,0,.18);";
      t.textContent = msg;
      document.body.appendChild(t);
      setTimeout(function () { t.remove(); }, 3200);
    }
  }

  /* ============================================================
     1. SIDEBAR NAVIGATION — switch active panel
  ============================================================ */
  var navBtns  = document.querySelectorAll(".sidebar-nav-item");
  var panels   = document.querySelectorAll(".settings-panel");

  navBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = btn.dataset.panel;

      // Update active button
      navBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");

      // Show target panel, hide others
      panels.forEach(function (p) {
        p.classList.toggle("active", p.id === "panel-" + target);
      });
    });
  });


  /* ============================================================
     2. THEME SYSTEM
     - Reads from localStorage key: "ht_theme_pref"
     - Values: "light" | "dark" | "system"
     - Applies/removes "dark-mode" class on <html>
     - Syncs the three UI controls (theme cards + quick btns)
  ============================================================ */

  // Apply theme to <html> element (works across all pages via shared CSS)
  function applyTheme(value) {
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var shouldBeDark = (value === "dark") || (value === "system" && prefersDark);

    document.documentElement.classList.toggle("dark-mode", shouldBeDark);

    // Also keep the old body class for backward-compat with style.css rules
    document.body.classList.toggle("ht-dark-mode", shouldBeDark);

    // Update the navbar toggle button icon (injected by script.js)
    var navToggle = document.getElementById("ht-theme-toggle");
    if (navToggle) {
      navToggle.innerHTML = shouldBeDark
        ? '<i class="bi bi-sun-fill"></i>'
        : '<i class="bi bi-moon-fill"></i>';
    }
  }

  // Save preference and apply
  function setTheme(value) {
    localStorage.setItem("ht_theme_pref", value);

    // Also sync old cookie key used by script.js so both systems agree
    if (typeof setCookie === "function") {
      setCookie("ht_theme", value === "system" ? "light" : value, 365);
    }

    applyTheme(value);
    syncThemeUI(value);
  }

  // Sync all theme UI controls to match stored value
  function syncThemeUI(value) {
    // Theme option cards
    ["light", "dark", "system"].forEach(function (v) {
      var card  = document.getElementById("theme-card-" + v);
      var radio = card ? card.querySelector("input") : null;
      if (card)  card.classList.toggle("selected", v === value);
      if (radio) radio.checked = (v === value);
    });

    // Quick theme buttons in sidebar
    ["light", "dark", "system"].forEach(function (v) {
      var btn = document.getElementById("qt-" + v);
      if (btn) btn.classList.toggle("active", v === value);
    });
  }

  // Initialise theme on page load
  var savedTheme = localStorage.getItem("ht_theme_pref") || "system";
  applyTheme(savedTheme);
  syncThemeUI(savedTheme);

  // Theme option card clicks
  document.querySelectorAll(".theme-option-card").forEach(function (card) {
    card.addEventListener("click", function () {
      var radio = card.querySelector("input[name='theme-pref']");
      if (radio) {
        setTheme(radio.value);
        toast(
          radio.value === "dark"   ? "🌙 Dark mode enabled" :
          radio.value === "light"  ? "☀️ Light mode enabled" :
                                     "🖥️ System theme applied",
          "info"
        );
      }
    });
  });

  // Quick-theme sidebar button clicks
  ["light", "dark", "system"].forEach(function (v) {
    var btn = document.getElementById("qt-" + v);
    if (btn) {
      btn.addEventListener("click", function () {
        setTheme(v);
        toast(
          v === "dark"   ? "🌙 Dark mode enabled" :
          v === "light"  ? "☀️ Light mode enabled" :
                           "🖥️ System theme applied",
          "info"
        );
      });
    }
  });

  // Respond to OS preference changes when "system" is selected
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
    var current = localStorage.getItem("ht_theme_pref") || "system";
    if (current === "system") applyTheme("system");
  });


  /* ============================================================
     3. PROFILE — Load, Save, Reset, Photo upload
  ============================================================ */

  var PROFILE_KEY = "ht_profile_data";

  // All profile field IDs
  var profileFields = [
    "s-firstname", "s-lastname", "s-email",
    "s-phone", "s-location", "s-occupation",
    "s-website", "s-bio"
  ];

  // Load saved profile from localStorage
  function loadProfile() {
    var raw  = localStorage.getItem(PROFILE_KEY);
    if (!raw) return;

    var data = JSON.parse(raw);

    profileFields.forEach(function (id) {
      var el = document.getElementById(id);
      if (el && data[id] !== undefined) el.value = data[id];
    });

    // Restore photo
    if (data.photo) {
      showProfilePhoto(data.photo);
    }

    // Update sidebar display name / role
    updateSidebarMeta(data);
  }

  // Save profile to localStorage
  function saveProfile() {
    var data = {};
    profileFields.forEach(function (id) {
      var el = document.getElementById(id);
      data[id] = el ? el.value : "";
    });

    // Save current photo
    var preview = document.getElementById("profile-photo-preview");
    if (preview && preview.src && !preview.src.endsWith("/")) {
      data.photo = preview.src;
    }

    localStorage.setItem(PROFILE_KEY, JSON.stringify(data));
    updateSidebarMeta(data);

    // Show confirm banner
    var confirm = document.getElementById("profile-confirm");
    if (confirm) {
      confirm.classList.remove("d-none");
      setTimeout(function () { confirm.classList.add("d-none"); }, 3500);
    }

    toast("✅ Profile saved successfully!", "success");
  }

  // Reset profile fields
  function resetProfile() {
    profileFields.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.value = "";
    });
    // Reset photo
    hideProfilePhoto();
    updateSidebarMeta({});
    toast("Profile fields cleared.", "info");
  }

  // Show/hide photo elements
  function showProfilePhoto(src) {
    var img = document.getElementById("profile-photo-preview");
    var ph  = document.getElementById("profile-photo-placeholder");
    var sbImg = document.getElementById("sidebar-avatar-img");
    var sbPh  = document.getElementById("sidebar-avatar-placeholder");

    if (img) { img.src = src; img.style.display = "block"; }
    if (ph)  { ph.style.display = "none"; }
    if (sbImg) { sbImg.src = src; sbImg.style.display = "block"; }
    if (sbPh)  { sbPh.style.display = "none"; }
  }
  function hideProfilePhoto() {
    var img = document.getElementById("profile-photo-preview");
    var ph  = document.getElementById("profile-photo-placeholder");
    var sbImg = document.getElementById("sidebar-avatar-img");
    var sbPh  = document.getElementById("sidebar-avatar-placeholder");

    if (img) { img.src = ""; img.style.display = "none"; }
    if (ph)  { ph.style.display = "flex"; }
    if (sbImg) { sbImg.src = ""; sbImg.style.display = "none"; }
    if (sbPh)  { sbPh.style.display = "flex"; }
  }

  // Update the sidebar name & role from data
  function updateSidebarMeta(data) {
    var nameEl = document.getElementById("sidebar-display-name");
    var roleEl = document.getElementById("sidebar-display-role");

    var first = (data["s-firstname"] || "").trim();
    var last  = (data["s-lastname"]  || "").trim();
    var full  = [first, last].filter(Boolean).join(" ") || "Your Name";
    var occ   = (data["s-occupation"] || "Traveller").trim() || "Traveller";

    if (nameEl) nameEl.textContent = full;
    if (roleEl) roleEl.textContent = occ;
  }

  // Photo file upload handler
  var photoInput = document.getElementById("photo-upload");
  if (photoInput) {
    photoInput.addEventListener("change", function () {
      var file = this.files[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        toast("Image must be under 5MB.", "error");
        return;
      }
      var reader = new FileReader();
      reader.onload = function (e) {
        showProfilePhoto(e.target.result);
        toast("Photo updated — click Save Changes to keep it.", "info");
      };
      reader.readAsDataURL(file);
    });
  }

  // Save / Reset button listeners
  var saveBtn  = document.getElementById("profile-save-btn");
  var resetBtn = document.getElementById("profile-reset-btn");
  if (saveBtn)  saveBtn.addEventListener("click",  saveProfile);
  if (resetBtn) resetBtn.addEventListener("click", resetProfile);

  // Load on page init
  loadProfile();

  // Live-update sidebar name as user types
  ["s-firstname", "s-lastname", "s-occupation"].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener("input", function () {
        var data = {};
        profileFields.forEach(function (fid) {
          var f = document.getElementById(fid);
          data[fid] = f ? f.value : "";
        });
        updateSidebarMeta(data);
      });
    }
  });


  /* ============================================================
     4. NOTIFICATIONS — Save preferences to localStorage
  ============================================================ */

  var NOTIF_KEY = "ht_notif_prefs";

  function loadNotifications() {
    var raw = localStorage.getItem(NOTIF_KEY);
    if (!raw) return;
    var data = JSON.parse(raw);
    ["notif-deals", "notif-newsletter", "notif-booking", "notif-price"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el && data[id] !== undefined) el.checked = data[id];
    });
  }

  function saveNotifications() {
    var data = {};
    ["notif-deals", "notif-newsletter", "notif-booking", "notif-price"].forEach(function (id) {
      var el = document.getElementById(id);
      data[id] = el ? el.checked : false;
    });
    localStorage.setItem(NOTIF_KEY, JSON.stringify(data));

    var confirm = document.getElementById("notif-confirm");
    if (confirm) {
      confirm.classList.remove("d-none");
      setTimeout(function () { confirm.classList.add("d-none"); }, 3500);
    }
    toast("✅ Notification preferences saved!", "success");
  }

  loadNotifications();
  var notifSaveBtn = document.getElementById("notif-save-btn");
  if (notifSaveBtn) notifSaveBtn.addEventListener("click", saveNotifications);


  /* ============================================================
     5. SECURITY — Password strength + show/hide + save
  ============================================================ */

  // Password show/hide toggles
  document.querySelectorAll(".pw-toggle-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var targetId = btn.dataset.target;
      var input    = document.getElementById(targetId);
      if (!input) return;
      var isText = input.type === "text";
      input.type = isText ? "password" : "text";
      btn.querySelector("i").className = isText ? "bi bi-eye" : "bi bi-eye-slash";
    });
  });

  // Password strength checker
  var newPwInput = document.getElementById("s-new-pw");
  if (newPwInput) {
    newPwInput.addEventListener("input", function () {
      var val   = this.value;
      var wrap  = document.getElementById("pw-strength-wrap");
      var fill  = document.getElementById("pw-strength-fill");
      var label = document.getElementById("pw-strength-label");

      if (!val) {
        if (wrap) wrap.style.display = "none";
        return;
      }
      if (wrap) wrap.style.display = "block";

      // Score: length, numbers, uppercase, special chars
      var score = 0;
      if (val.length >= 8)             score++;
      if (val.length >= 12)            score++;
      if (/[0-9]/.test(val))           score++;
      if (/[A-Z]/.test(val))           score++;
      if (/[^A-Za-z0-9]/.test(val))    score++;

      var pct    = (score / 5) * 100;
      var color  = score <= 1 ? "#e74c3c" : score <= 3 ? "#f39c12" : "#28a745";
      var text   = score <= 1 ? "Weak" : score <= 3 ? "Moderate" : "Strong";

      if (fill)  { fill.style.width = pct + "%"; fill.style.background = color; }
      if (label) { label.textContent = text; label.style.color = color; }
    });
  }

  // Password save
  var pwSaveBtn = document.getElementById("pw-save-btn");
  if (pwSaveBtn) {
    pwSaveBtn.addEventListener("click", function () {
      var curr    = (document.getElementById("s-curr-pw")    || {}).value || "";
      var newPw   = (document.getElementById("s-new-pw")     || {}).value || "";
      var confirm = (document.getElementById("s-confirm-pw") || {}).value || "";
      var msgEl   = document.getElementById("pw-confirm");

      if (!curr || !newPw || !confirm) {
        toast("Please fill in all password fields.", "error");
        return;
      }
      if (newPw !== confirm) {
        toast("New passwords do not match.", "error");
        return;
      }
      if (newPw.length < 6) {
        toast("Password must be at least 6 characters.", "error");
        return;
      }

      // Success (demo — no real auth)
      if (msgEl) {
        msgEl.className = "save-confirm mt-2";
        msgEl.innerHTML = '<i class="bi bi-check-circle-fill me-1"></i> Password updated successfully!';
        setTimeout(function () { msgEl.className = "save-confirm d-none mt-2"; }, 3500);
      }
      toast("✅ Password updated!", "success");

      // Clear fields
      ["s-curr-pw", "s-new-pw", "s-confirm-pw"].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.value = "";
      });
      var wrap = document.getElementById("pw-strength-wrap");
      if (wrap) wrap.style.display = "none";
    });
  }

  // Clear All Data button
  var clearBtn = document.getElementById("clear-data-btn");
  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      if (!confirm("This will clear your profile, theme preference, and cookie settings. Continue?")) return;

      // Clear localStorage keys
      ["ht_profile_data", "ht_notif_prefs", "ht_theme_pref"].forEach(function (k) {
        localStorage.removeItem(k);
      });

      // Clear cookies
      if (typeof deleteCookie === "function") {
        deleteCookie("ht_theme");
        deleteCookie("ht_cookie_consent");
        deleteCookie("ht_last_dest");
        deleteCookie("ht_recent_dests");
      }

      toast("All saved data cleared. Refreshing…", "info", 2000);
      setTimeout(function () { location.reload(); }, 2000);
    });
  }


  /* ============================================================
     6. NAVBAR SCROLL SHADOW + MOBILE CLOSE
        (mirrors script.js for pages that also load it,
         but settings.html loads script.js too, so just guard)
  ============================================================ */
  var navbar = document.querySelector(".navbar");
  if (navbar) {
    window.addEventListener("scroll", function () {
      navbar.classList.toggle("scrolled-nav", window.scrollY > 50);
    });
  }

  // Update the theme-toggle button icon on settings page
  // (script.js injects this button on index.html; on settings.html
  //  the button is in the HTML itself, so we just sync its icon)
  var navToggle = document.getElementById("ht-theme-toggle");
  if (navToggle) {
    var isDarkNow = document.documentElement.classList.contains("dark-mode");
    navToggle.innerHTML = isDarkNow
      ? '<i class="bi bi-sun-fill"></i>'
      : '<i class="bi bi-moon-fill"></i>';

    navToggle.addEventListener("click", function () {
      var current = localStorage.getItem("ht_theme_pref") || "system";
      var next    = document.documentElement.classList.contains("dark-mode") ? "light" : "dark";
      setTheme(next);
      toast(next === "dark" ? "🌙 Dark mode enabled" : "☀️ Light mode enabled", "info");
    });
  }

}); // END DOMContentLoaded