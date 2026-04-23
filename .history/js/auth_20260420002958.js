/* =============================================
   HERO TRAVEL — auth.js
   Split-Circle Login / Sign Up Interface
   Matches Hero Travel design system
============================================= */

document.addEventListener("DOMContentLoaded", function () {

  /* ──────────────────────────────────────────
     ELEMENT REFERENCES
  ────────────────────────────────────────── */
  var authPage          = document.getElementById("authPage");
  var stageCircle       = document.getElementById("stageCircle");
  var stageLogin        = document.getElementById("stageLogin");
  var stageSignup       = document.getElementById("stageSignup");
  var halfLogin         = document.getElementById("halfLogin");                                                                                                                                                                                                                                                           
  var halfSignup        = document.getElementById("halfSignup");
  var backFromLogin     = document.getElementById("backFromLogin");
  var backFromSignup    = document.getElementById("backFromSignup");
  var switchToSignup    = document.getElementById("switchToSignup");
  var switchToLogin     = document.getElementById("switchToLogin");
  var forgotPwLink      = document.getElementById("forgotPwLink");
  var loginSubmitBtn    = document.getElementById("loginSubmitBtn");
  var signupSubmitBtn   = document.getElementById("signupSubmitBtn");
  var signupStrengthWrap = document.getElementById("signupStrengthWrap");
  var signupStrengthFill = document.getElementById("signupStrengthFill");
  var signupStrengthLabel = document.getElementById("signupStrengthLabel");

  /* ──────────────────────────────────────────
     TOAST HELPER
  ────────────────────────────────────────── */
// REPLACE every call to toast(...) with showToast(...) directly:
showToast("Please fix the highlighted fields.", "error");

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

  function exitCircle() {
    stageCircle.classList.add("auth-stage-exiting");
  }

  function restoreCircle() {
    stageCircle.classList.remove("auth-stage-exiting");
  }

  /* ──────────────────────────────────────────
     CIRCLE HOVER EFFECTS (background dimming)
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
      setTimeout(function () {
        showStage(stageLogin);
      }, 250);
    });
  }

  if (halfSignup) {
    halfSignup.addEventListener("click", function () {
      authPage.classList.remove("hover-login", "hover-signup");
      exitCircle();
      setTimeout(function () {
        showStage(stageSignup);
      }, 250);
    });
  }

  /* ──────────────────────────────────────────
     BACK BUTTONS → RESTORE CIRCLE
  ────────────────────────────────────────── */
  if (backFromLogin) {
    backFromLogin.addEventListener("click", function () {
      hideStage(stageLogin);
      clearLoginFields();
      setTimeout(function () {
        restoreCircle();
      }, 100);
    });
  }

  if (backFromSignup) {
    backFromSignup.addEventListener("click", function () {
      hideStage(stageSignup);
      clearSignupFields();
      setTimeout(function () {
        restoreCircle();
      }, 100);
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
      setTimeout(function () {
        showStage(stageSignup);
      }, 200);
    });
  }

  if (switchToLogin) {
    switchToLogin.addEventListener("click", function (e) {
      e.preventDefault();
      hideStage(stageSignup);
      clearSignupFields();
      setTimeout(function () {
        showStage(stageLogin);
      }, 200);
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
        toast("Password reset link sent to " + email + " 📧", "success", 3500);
      } else {
        toast("Please enter your email address first.", "error");
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
      var targetId = btn.dataset.target;
      var input = document.getElementById(targetId);
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
      if (val.length >= 8)            score++;
      if (val.length >= 12)           score++;
      if (/[0-9]/.test(val))          score++;
      if (/[A-Z]/.test(val))          score++;
      if (/[^A-Za-z0-9]/.test(val))   score++;

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

  // Live: remove error state while typing, apply valid
  var allInputIds = [
    "login-email", "login-password",
    "signup-name", "signup-email", "signup-password", "signup-confirm"
  ];
  allInputIds.forEach(function (id) {
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
  ────────────────────────────────────────── */
  if (loginSubmitBtn) {
    loginSubmitBtn.addEventListener("click", function () {
      var emailEl = document.getElementById("login-email");
      var pwEl    = document.getElementById("login-password");
      var ok      = true;

      if (!validateInput(emailEl, function (v) { return v.includes("@") && v.includes("."); })) ok = false;
      if (!validateInput(pwEl,    function (v) { return v.length >= 6; })) ok = false;

      if (!ok) {
        toast("Please fix the highlighted fields.", "error");
        return;
      }

      // Loading state
      var origHTML = loginSubmitBtn.innerHTML;
      loginSubmitBtn.innerHTML = '<span class="btn-text">Signing in…</span><i class="bi bi-hourglass-split btn-arrow"></i>';
      loginSubmitBtn.disabled = true;
      loginSubmitBtn.style.opacity = "0.8";

      setTimeout(function () {
        // Success
        loginSubmitBtn.innerHTML = '<span class="btn-text">Signed In!</span><i class="bi bi-check-lg btn-arrow"></i>';
        loginSubmitBtn.style.background = "#28a745";
        loginSubmitBtn.style.opacity = "1";

        var confirmEl = document.getElementById("login-confirm");
        if (confirmEl) confirmEl.classList.remove("d-none");

        toast("✅ Welcome back! Redirecting…", "success", 3000);

        // Persist login state
        var userData = { email: emailEl.value, loggedIn: true, loginTime: Date.now() };
        try { localStorage.setItem("ht_auth_user", JSON.stringify(userData)); } catch (e) {}

        // Reset after delay
        setTimeout(function () {
          loginSubmitBtn.innerHTML = origHTML;
          loginSubmitBtn.style.background = "";
          loginSubmitBtn.style.opacity = "";
          loginSubmitBtn.disabled = false;
          if (confirmEl) confirmEl.classList.add("d-none");
          clearLoginFields();
          hideStage(stageLogin);
          setTimeout(restoreCircle, 100);
        }, 3200);
      }, 900);
    });
  }

  /* ──────────────────────────────────────────
     SIGN UP SUBMIT
  ────────────────────────────────────────── */
  if (signupSubmitBtn) {
    signupSubmitBtn.addEventListener("click", function () {
      var nameEl    = document.getElementById("signup-name");
      var emailEl   = document.getElementById("signup-email");
      var pwEl      = document.getElementById("signup-password");
      var confirmEl = document.getElementById("signup-confirm");
      var ok        = true;

      if (!validateInput(nameEl,    function (v) { return v.trim().length > 1; }))                     ok = false;
      if (!validateInput(emailEl,   function (v) { return v.includes("@") && v.includes("."); }))      ok = false;
      if (!validateInput(pwEl,      function (v) { return v.length >= 6; }))                           ok = false;
      if (!validateInput(confirmEl, function (v) { return v.length >= 6 && v === pwEl.value; }))       ok = false;

      if (pwEl && confirmEl && pwEl.value !== confirmEl.value) {
        toast("Passwords do not match.", "error");
        confirmEl.classList.add("is-error");
        shakeEl(confirmEl);
        return;
      }
      if (!ok) {
        toast("Please fix the highlighted fields.", "error");
        return;
      }

      // Loading state
      var origHTML = signupSubmitBtn.innerHTML;
      signupSubmitBtn.innerHTML = '<span class="btn-text">Creating account…</span><i class="bi bi-hourglass-split btn-arrow"></i>';
      signupSubmitBtn.disabled = true;
      signupSubmitBtn.style.opacity = "0.8";

      setTimeout(function () {
        // Success
        signupSubmitBtn.innerHTML = '<span class="btn-text">Account Created!</span><i class="bi bi-check-lg btn-arrow"></i>';
        signupSubmitBtn.style.background = "#28a745";
        signupSubmitBtn.style.color = "#fff";
        signupSubmitBtn.style.opacity = "1";

        var msgEl = document.getElementById("signup-confirm");
        if (msgEl) msgEl.classList.remove("d-none");

        toast("🎉 Account created! Welcome to Hero Travel.", "success", 4000);

        // Persist
        var userData = {
          name:      nameEl ? nameEl.value : "",
          email:     emailEl ? emailEl.value : "",
          loggedIn:  true,
          joinTime:  Date.now()
        };
        try { localStorage.setItem("ht_auth_user", JSON.stringify(userData)); } catch (e) {}

        // Also pre-fill profile page name fields if blank
        try {
          var profileRaw = localStorage.getItem("ht_profile_data");
          var profile    = profileRaw ? JSON.parse(profileRaw) : {};
          if (!profile["s-firstname"] && userData.name) {
            var parts = userData.name.trim().split(" ");
            profile["s-firstname"] = parts[0] || "";
            profile["s-lastname"]  = parts.slice(1).join(" ") || "";
            profile["s-email"]     = userData.email || "";
            localStorage.setItem("ht_profile_data", JSON.stringify(profile));
          }
        } catch (e) {}

        setTimeout(function () {
          signupSubmitBtn.innerHTML = origHTML;
          signupSubmitBtn.style.background = "";
          signupSubmitBtn.style.color = "";
          signupSubmitBtn.style.opacity = "";
          signupSubmitBtn.disabled = false;
          if (msgEl) msgEl.classList.add("d-none");
          clearSignupFields();
          hideStage(stageSignup);
          setTimeout(restoreCircle, 100);
        }, 3800);
      }, 900);
    });
  }

  /* ──────────────────────────────────────────
     SOCIAL LOGIN BUTTONS
  ────────────────────────────────────────── */
  document.querySelectorAll(".auth-social-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var provider = btn.dataset.provider || "Social";
      toast(provider + " login coming soon! 🚀", "info", 2800);
    });
  });

  /* ──────────────────────────────────────────
     FIELD CLEAR HELPERS
  ────────────────────────────────────────── */
  function clearLoginFields() {
    ["login-email", "login-password"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.value = ""; el.classList.remove("is-valid", "is-error"); el.type = "password"; }
    });
    // Reset eye icons
    document.querySelectorAll("#stageLogin .auth-pw-toggle i").forEach(function (i) {
      i.className = "bi bi-eye";
    });
  }

  function clearSignupFields() {
    ["signup-name", "signup-email", "signup-password", "signup-confirm"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) {
        el.value = "";
        el.classList.remove("is-valid", "is-error");
        if (el.type === "text" && id !== "signup-name" && id !== "signup-email") el.type = "password";
      }
    });
    if (signupStrengthWrap) signupStrengthWrap.style.display = "none";
    // Reset eye icons
    document.querySelectorAll("#stageSignup .auth-pw-toggle i").forEach(function (i) {
      i.className = "bi bi-eye";
    });
  }

  /* ──────────────────────────────────────────
     NAVBAR SCROLL SHADOW
  ────────────────────────────────────────── */
  var navbar = document.querySelector(".navbar");
  if (navbar) {
    window.addEventListener("scroll", function () {
      navbar.classList.toggle("scrolled-nav", window.scrollY > 50);
    });
  }

  /* ──────────────────────────────────────────
     KEYBOARD: ESC key closes current form
  ────────────────────────────────────────── */
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (!stageLogin.classList.contains("auth-stage-hidden")) {
      hideStage(stageLogin);
      clearLoginFields();
      setTimeout(restoreCircle, 100);
    }
    if (!stageSignup.classList.contains("auth-stage-hidden")) {
      hideStage(stageSignup);
      clearSignupFields();
      setTimeout(restoreCircle, 100);
    }
  });

  /* ──────────────────────────────────────────
     KEYBOARD: Enter submits the active form
  ────────────────────────────────────────── */
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
     IF USER IS ALREADY LOGGED IN, SHOW STATE
  ────────────────────────────────────────── */
  try {
    var savedUser = JSON.parse(localStorage.getItem("ht_auth_user") || "null");
    if (savedUser && savedUser.loggedIn) {
      var name = savedUser.name || savedUser.email || "traveller";
      // Update the nav link text
      var authNavLink = document.querySelector('a[href="auth.html"].nav-link');
      if (authNavLink) {
        authNavLink.textContent = "👤 " + (savedUser.name ? savedUser.name.split(" ")[0] : "Account");
      }
    }
  } catch (e) {}

}); // END DOMContentLoaded