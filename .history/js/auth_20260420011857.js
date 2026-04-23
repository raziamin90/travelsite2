/* =============================================
   HERO TRAVEL — auth.js  (updated)
   Split-Circle Login / Sign Up Interface

   Key changes vs. original:
   ✅ After successful LOGIN  → redirect to profile.html
   ✅ After successful SIGNUP → auto-login + redirect to profile.html
   ✅ toast() renamed to showToast() throughout
   ✅ Removed stale inline toast helper; showToast is defined here
      so auth.html doesn't need script.js loaded alongside it.
============================================= */

document.addEventListener("DOMContentLoaded", function () {

  /* ──────────────────────────────────────────
     ELEMENT REFERENCES
  ────────────────────────────────────────── */
  var authPage            = document.getElementById("authPage");
  var stageCircle         = document.getElementById("stageCircle");
  var stageLogin          = document.getElementById("stageLogin");
  var stageSignup         = document.getElementById("stageSignup");
  var halfLogin           = document.getElementById("halfLogin");
  var halfSignup          = document.getElementById("halfSignup");
  var backFromLogin       = document.getElementById("backFromLogin");
  var backFromSignup      = document.getElementById("backFromSignup");
  var switchToSignup      = document.getElementById("switchToSignup");
  var switchToLogin       = document.getElementById("switchToLogin");
  var forgotPwLink        = document.getElementById("forgotPwLink");
  var loginSubmitBtn      = document.getElementById("loginSubmitBtn");
  var signupSubmitBtn     = document.getElementById("signupSubmitBtn");
  var signupStrengthWrap  = document.getElementById("signupStrengthWrap");
  var signupStrengthFill  = document.getElementById("signupStrengthFill");
  var signupStrengthLabel = document.getElementById("signupStrengthLabel");

  /* ──────────────────────────────────────────
     TOAST SYSTEM
     (Standalone copy so auth.html works without
      script.js. Identical API: showToast(msg, type, ms))
  ────────────────────────────────────────── */
  (function injectToastStyles() {
    if (document.getElementById("ht-auth-toast-style")) return;
    var s = document.createElement("style");
    s.id = "ht-auth-toast-style";
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
  })();

  var toastContainer = (function () {
    var el = document.getElementById("ht-toast-container");
    if (!el) {
      el = document.createElement("div");
      el.id = "ht-toast-container";
      document.body.appendChild(el);
    }
    return el;
  })();

  function showToast(message, type, duration) {
    type     = type     || "info";
    duration = duration || 3200;
    var icons = { success: "✅", error: "❌", info: "✈️" };
    var toast = document.createElement("div");
    toast.className = "ht-toast " + type;
    toast.innerHTML = "<span>" + (icons[type] || "") + "</span><span>" + message + "</span>";
    toastContainer.appendChild(toast);
    setTimeout(function () {
      toast.classList.add("fadeout");
      toast.addEventListener("animationend", function () { toast.remove(); }, { once: true });
    }, duration);
  }

  /* ──────────────────────────────────────────
     REDIRECT AFTER AUTH
     Change these constants to point elsewhere.
  ────────────────────────────────────────── */
  var AFTER_AUTH_REDIRECT = "profile.html";

  /* ──────────────────────────────────────────
     STAGE TRANSITIONS
  ────────────────────────────────────────── */
  function showStage(stage) {
    stage.classList.remove("auth-stage-hidden");
    stage.classList.add("auth-stage-visible");
  }

  function hideStage(stage) {
    stage.classList.remove("auth-stage-visible");
    stage.classList.add("auth-stage-hidden");
  }

  function exitCircle()    { stageCircle.classList.add("auth-stage-exiting"); }
  function restoreCircle() { stageCircle.classList.remove("auth-stage-exiting"); }

  /* ──────────────────────────────────────────
     CIRCLE HOVER EFFECTS
  ────────────────────────────────────────── */
  if (halfLogin) {
    halfLogin.addEventListener("mouseenter", function () {
      if (authPage) authPage.classList.add("hover-login");
    });
    halfLogin.addEventListener("mouseleave", function () {
      if (authPage) authPage.classList.remove("hover-login");
    });
  }

  if (halfSignup) {
    halfSignup.addEventListener("mouseenter", function () {
      if (authPage) authPage.classList.add("hover-signup");
    });
    halfSignup.addEventListener("mouseleave", function () {
      if (authPage) authPage.classList.remove("hover-signup");
    });
  }

  /* ──────────────────────────────────────────
     HALF CLICKS → OPEN PANELS
  ────────────────────────────────────────── */
  if (halfLogin) {
    halfLogin.addEventListener("click", function () {
      authPage.classList.remove("hover-login", "hover-signup");
      exitCircle();
      setTimeout(function () { showStage(stageLogin); }, 250);
    });
  }

  if (halfSignup) {
    halfSignup.addEventListener("click", function () {
      authPage.classList.remove("hover-login", "hover-signup");
      exitCircle();
      setTimeout(function () { showStage(stageSignup); }, 250);
    });
  }

  /* ──────────────────────────────────────────
     BACK BUTTONS
  ────────────────────────────────────────── */
  if (backFromLogin) {
    backFromLogin.addEventListener("click", function () {
      hideStage(stageLogin);
      clearLoginFields();
      setTimeout(restoreCircle, 100);
    });
  }

  if (backFromSignup) {
    backFromSignup.addEventListener("click", function () {
      hideStage(stageSignup);
      clearSignupFields();
      setTimeout(restoreCircle, 100);
    });
  }

  /* ──────────────────────────────────────────
     SWITCH BETWEEN FORMS
  ────────────────────────────────────────── */
  if (switchToSignup) {
    switchToSignup.addEventListener("click", function (e) {
      e.preventDefault();
      hideStage(stageLogin);
      clearLoginFields();
      setTimeout(function () { showStage(stageSignup); }, 200);
    });
  }

  if (switchToLogin) {
    switchToLogin.addEventListener("click", function (e) {
      e.preventDefault();
      hideStage(stageSignup);
      clearSignupFields();
      setTimeout(function () { showStage(stageLogin); }, 200);
    });
  }

  /* ──────────────────────────────────────────
     FORGOT PASSWORD
  ────────────────────────────────────────── */
  if (forgotPwLink) {
    forgotPwLink.addEventListener("click", function (e) {
      e.preventDefault();
      var email = (document.getElementById("login-email") || {}).value || "";
      if (email && email.includes("@")) {
        showToast("Password reset link sent to " + email + " 📧", "success", 3500);
      } else {
        showToast("Please enter your email address first.", "error");
        var emailInput = document.getElementById("login-email");
        if (emailInput) {
          emailInput.classList.add("is-error");
          shakeEl(emailInput);
          emailInput.focus();
        }
      }
    });
  }

  /* ──────────────────────────────────────────
     PASSWORD SHOW / HIDE TOGGLES
  ────────────────────────────────────────── */
  document.querySelectorAll(".auth-pw-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var input = document.getElementById(btn.dataset.target);
      if (!input) return;
      var isText = input.type === "text";
      input.type = isText ? "password" : "text";
      var icon = btn.querySelector("i");
      if (icon) icon.className = isText ? "bi bi-eye" : "bi bi-eye-slash";
    });
  });

  /* ──────────────────────────────────────────
     PASSWORD STRENGTH CHECKER (Sign Up)
  ────────────────────────────────────────── */
  var signupPwInput = document.getElementById("signup-password");
  if (signupPwInput) {
    signupPwInput.addEventListener("input", function () {
      var val = this.value;
      if (!val) {
        if (signupStrengthWrap) signupStrengthWrap.style.display = "none";
        return;
      }
      if (signupStrengthWrap) signupStrengthWrap.style.display = "flex";

      var score = 0;
      if (val.length >= 8)          score++;
      if (val.length >= 12)         score++;
      if (/[0-9]/.test(val))        score++;
      if (/[A-Z]/.test(val))        score++;
      if (/[^A-Za-z0-9]/.test(val)) score++;

      var pct   = (score / 5) * 100;
      var color = score <= 1 ? "#e74c3c" : score <= 3 ? "#f39c12" : "#28a745";
      var text  = score <= 1 ? "Weak"    : score <= 3 ? "Moderate" : "Strong";

      if (signupStrengthFill) {
        signupStrengthFill.style.width      = pct + "%";
        signupStrengthFill.style.background = color;
      }
      if (signupStrengthLabel) {
        signupStrengthLabel.textContent = text;
        signupStrengthLabel.style.color = color;
      }
    });
  }

  /* ──────────────────────────────────────────
     VALIDATION HELPERS
  ────────────────────────────────────────── */
  function validateInput(el, checkFn) {
    if (!el) return false;
    var valid = checkFn(el.value);
    el.classList.toggle("is-error", !valid);
    el.classList.toggle("is-valid",  valid);
    if (!valid) shakeEl(el);
    return valid;
  }

  function shakeEl(el) {
    el.style.animation = "htShake .4s ease";
    el.addEventListener("animationend", function () {
      el.style.animation = "";
    }, { once: true });
  }

  // Live: clear error on input
  ["login-email","login-password",
   "signup-name","signup-email","signup-password","signup-confirm"
  ].forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("input", function () {
      el.classList.remove("is-error");
      if (el.value.trim()) el.classList.add("is-valid");
      else el.classList.remove("is-valid");
    });
  });

  /* ──────────────────────────────────────────
     LOGIN SUBMIT
     ✅ CHANGED: redirects to profile.html
  ────────────────────────────────────────── */
  if (loginSubmitBtn) {
    loginSubmitBtn.addEventListener("click", function () {
      var emailEl = document.getElementById("login-email");
      var pwEl    = document.getElementById("login-password");
      var ok      = true;

      if (!validateInput(emailEl, function (v) { return v.includes("@") && v.includes("."); })) ok = false;
      if (!validateInput(pwEl,    function (v) { return v.length >= 6; })) ok = false;

      if (!ok) {
        showToast("Please fix the highlighted fields.", "error");
        return;
      }

      // Loading state
      var origHTML = loginSubmitBtn.innerHTML;
      loginSubmitBtn.innerHTML = '<span class="btn-text">Signing in…</span><i class="bi bi-hourglass-split btn-arrow"></i>';
      loginSubmitBtn.disabled = true;
      loginSubmitBtn.style.opacity = "0.8";

      setTimeout(function () {
        // Persist login
        var userData = { email: emailEl.value, loggedIn: true, loginTime: Date.now() };
        try { localStorage.setItem("ht_auth_user", JSON.stringify(userData)); } catch (e) {}

        loginSubmitBtn.innerHTML = '<span class="btn-text">Signed In!</span><i class="bi bi-check-lg btn-arrow"></i>';
        loginSubmitBtn.style.background = "#28a745";
        loginSubmitBtn.style.opacity    = "1";

        var confirmEl = document.getElementById("login-confirm");
        if (confirmEl) confirmEl.classList.remove("d-none");

        showToast("✅ Welcome back! Redirecting to your profile…", "success", 2500);

        // ✅ Redirect to profile.html after short delay
        setTimeout(function () {
          window.location.href = AFTER_AUTH_REDIRECT;
        }, 1200);
      }, 900);
    });
  }

  /* ──────────────────────────────────────────
     SIGN UP SUBMIT
     ✅ CHANGED: saves user + redirects to profile.html
  ────────────────────────────────────────── */
  if (signupSubmitBtn) {
    signupSubmitBtn.addEventListener("click", function () {
      var nameEl    = document.getElementById("signup-name");
      var emailEl   = document.getElementById("signup-email");
      var pwEl      = document.getElementById("signup-password");
      var confirmEl = document.getElementById("signup-confirm");
      var ok        = true;

      if (!validateInput(nameEl,    function (v) { return v.trim().length > 1; }))                ok = false;
      if (!validateInput(emailEl,   function (v) { return v.includes("@") && v.includes("."); })) ok = false;
      if (!validateInput(pwEl,      function (v) { return v.length >= 6; }))                      ok = false;
      if (!validateInput(confirmEl, function (v) { return v.length >= 6 && v === pwEl.value; }))  ok = false;

      if (pwEl && confirmEl && pwEl.value !== confirmEl.value) {
        showToast("Passwords do not match.", "error");
        confirmEl.classList.add("is-error");
        shakeEl(confirmEl);
        return;
      }
      if (!ok) {
        showToast("Please fix the highlighted fields.", "error");
        return;
      }

      // Loading
      var origHTML = signupSubmitBtn.innerHTML;
      signupSubmitBtn.innerHTML = '<span class="btn-text">Creating account…</span><i class="bi bi-hourglass-split btn-arrow"></i>';
      signupSubmitBtn.disabled = true;
      signupSubmitBtn.style.opacity = "0.8";

      setTimeout(function () {
        // Persist new user + log them in immediately
        var userData = {
          name:     nameEl  ? nameEl.value  : "",
          email:    emailEl ? emailEl.value : "",
          loggedIn: true,
          joinTime: Date.now()
        };
        try { localStorage.setItem("ht_auth_user", JSON.stringify(userData)); } catch (e) {}

        // Pre-fill profile page name fields if blank
        try {
          var profileRaw = localStorage.getItem("ht_profile_data");
          var profile    = profileRaw ? JSON.parse(profileRaw) : {};
          if (!profile["s-firstname"] && userData.name) {
            var parts = userData.name.trim().split(" ");
            profile["s-firstname"] = parts[0]               || "";
            profile["s-lastname"]  = parts.slice(1).join(" ") || "";
            profile["s-email"]     = userData.email          || "";
            localStorage.setItem("ht_profile_data", JSON.stringify(profile));
          }
        } catch (e) {}

        signupSubmitBtn.innerHTML = '<span class="btn-text">Account Created!</span><i class="bi bi-check-lg btn-arrow"></i>';
        signupSubmitBtn.style.background = "#28a745";
        signupSubmitBtn.style.color      = "#fff";
        signupSubmitBtn.style.opacity    = "1";

        var msgEl = document.getElementById("signup-confirm");
        if (msgEl) msgEl.classList.remove("d-none");

        showToast("🎉 Account created! Redirecting to your profile…", "success", 2500);

        // ✅ Redirect to profile.html after short delay
        setTimeout(function () {
          window.location.href = AFTER_AUTH_REDIRECT;
        }, 1200);
      }, 900);
    });
  }

  /* ──────────────────────────────────────────
     SOCIAL LOGIN BUTTONS
  ────────────────────────────────────────── */
  document.querySelectorAll(".auth-social-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var provider = btn.dataset.provider || "Social";
      showToast(provider + " login coming soon! 🚀", "info", 2800);
    });
  });

  /* ──────────────────────────────────────────
     FIELD CLEAR HELPERS
  ────────────────────────────────────────── */
  function clearLoginFields() {
    ["login-email","login-password"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.value = ""; el.classList.remove("is-valid","is-error"); el.type = "password"; }
    });
    document.querySelectorAll("#stageLogin .auth-pw-toggle i").forEach(function (i) {
      i.className = "bi bi-eye";
    });
  }

  function clearSignupFields() {
    ["signup-name","signup-email","signup-password","signup-confirm"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) {
        el.value = "";
        el.classList.remove("is-valid","is-error");
        if (el.type === "text" && id !== "signup-name" && id !== "signup-email") el.type = "password";
      }
    });
    if (signupStrengthWrap) signupStrengthWrap.style.display = "none";
    document.querySelectorAll("#stageSignup .auth-pw-toggle i").forEach(function (i) {
      i.className = "bi bi-eye";
    });
  }

  /* ──────────────────────────────────────────
     KEYBOARD: ESC closes form, Enter submits
  ────────────────────────────────────────── */
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (stageLogin && !stageLogin.classList.contains("auth-stage-hidden")) {
      hideStage(stageLogin); clearLoginFields(); setTimeout(restoreCircle, 100);
    }
    if (stageSignup && !stageSignup.classList.contains("auth-stage-hidden")) {
      hideStage(stageSignup); clearSignupFields(); setTimeout(restoreCircle, 100);
    }
  });

  document.querySelectorAll("#stageLogin .auth-input").forEach(function (inp) {
    inp.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && loginSubmitBtn) loginSubmitBtn.click();
    });
  });
  document.querySelectorAll("#stageSignup .auth-input").forEach(function (inp) {
    inp.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && signupSubmitBtn) signupSubmitBtn.click();
    });
  });

  /* ──────────────────────────────────────────
     IF ALREADY LOGGED IN — redirect away from auth page
     (user navigated to auth.html while logged in)
  ────────────────────────────────────────── */
  try {
    var savedUser = JSON.parse(localStorage.getItem("ht_auth_user") || "null");
    if (savedUser && savedUser.loggedIn) {
      // Already authenticated — send straight to profile
      window.location.replace(AFTER_AUTH_REDIRECT);
    }
  } catch (e) {}

}); // END DOMContentLoaded