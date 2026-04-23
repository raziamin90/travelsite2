/* =============================================
   HERO TRAVEL — navbar.js
   Modular, state-aware navbar loader.

   Responsibilities:
   1. Fetch and inject navbar.html into every page.
   2. Detect login state from localStorage.
   3. Show "Login" link when logged out, or a user
      dropdown (with "Profile" + "Logout") when logged in.
   4. Highlight the active nav link for the current page.
   5. Handle logout (clear auth state + redirect).

   Usage — add ONE script tag to every page's <head>
   (or just before </body>):
     <script src="js/navbar.js" defer></script>

   Remove the hard-coded <nav> block from every page
   and replace it with:
     <div id="ht-navbar-root"></div>
============================================= */

(function () {
    "use strict";

    /* --------------------------------------------------
       THEME INIT (runs before paint to prevent flash)
       Keep this here so navbar.js is the single script
       needed in <head>; individual pages no longer need
       their own inline theme-init block.
    -------------------------------------------------- */
    (function applyThemeEarly() {
        var theme = localStorage.getItem("ht_theme_pref") || "system";
        var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        var dark = theme === "dark" || (theme === "system" && prefersDark);
        if (dark) {
            document.documentElement.classList.add("dark-mode");
            document.documentElement.style.background = "#121212";
        }
    })();

    /* --------------------------------------------------
       AUTH GUARD
       Pages that require login list themselves in
       PROTECTED_PAGES. Any other page is public.
    -------------------------------------------------- */
    var PROTECTED_PAGES = ["index.html", "contact.html", "profile.html", ""];
    // "" covers the bare domain root (which serves index.html)

    function currentPage() {
        var parts = window.location.pathname.split("/");
        return parts[parts.length - 1]; // e.g. "contact.html"
    }

    function isLoggedIn() {
        try {
            var u = JSON.parse(localStorage.getItem("ht_auth_user") || "null");
            return !!(u && u.loggedIn);
        } catch (e) {
            return false;
        }
    }

    function getUser() {
        try {
            return JSON.parse(localStorage.getItem("ht_auth_user") || "null");
        } catch (e) {
            return null;
        }
    }

    // Redirect to auth if visiting a protected page while logged out
    (function authGuard() {
        var page = currentPage();
        if (PROTECTED_PAGES.indexOf(page) !== -1 && !isLoggedIn()) {
            window.location.replace("auth.html");
        }
    })();

    /* --------------------------------------------------
       NAVBAR HTML TEMPLATE
       Inline template — no separate fetch() needed.
       If you prefer a separate navbar.html file you can
       swap the template string for a fetch() call instead.
    -------------------------------------------------- */
    var NAV_TEMPLATE = `
<nav class="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm" id="ht-navbar">
  <div class="container">
    <a class="navbar-brand d-flex align-items-center gap-2" href="index.html">
      <span class="logo-icon">
        <img src="assets/images/logo.svg" alt="Logo"
             style="width:32px;height:32px;object-fit:contain;" />
      </span>
      <span class="logo-text">Hero <span class="text-orange">Travel</span></span>
    </a>

    <button class="navbar-toggler border-0" type="button"
      data-bs-toggle="collapse" data-bs-target="#mainNav"
      aria-controls="mainNav" aria-expanded="false"
      aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse justify-content-end" id="mainNav">
      <ul class="navbar-nav gap-lg-2 mt-3 mt-lg-0">
        <li class="nav-item">
          <a class="nav-link fw-semibold" href="index.html"
             data-nav-page="index.html">Home</a>
        </li>
        <li class="nav-item">
          <a class="nav-link fw-semibold" href="index.html#packages">Packages</a>
        </li>
        <li class="nav-item">
          <a class="nav-link fw-semibold" href="index.html#testimonial">Testimonial</a>
        </li>
        <li class="nav-item">
          <a class="nav-link fw-semibold" href="index.html#blog">Blog</a>
        </li>
        <li class="nav-item">
          <a class="nav-link fw-semibold" href="contact.html"
             data-nav-page="contact.html">Contact</a>
        </li>

        <!-- AUTH SLOT — swapped by JS below -->
        <li class="nav-item" id="nav-auth-item">
          <a class="nav-link fw-semibold text-orange" href="auth.html"
             id="nav-auth-link">Login</a>
        </li>
      </ul>
    </div>
  </div>
</nav>`;

    /* --------------------------------------------------
       INJECT NAVBAR
    -------------------------------------------------- */
    function injectNavbar() {
        var root = document.getElementById("ht-navbar-root");
        if (!root) {
            // Fallback: prepend to body if no placeholder exists
            root = document.createElement("div");
            root.id = "ht-navbar-root";
            document.body.insertBefore(root, document.body.firstChild);
        }
        root.innerHTML = NAV_TEMPLATE;
    }

    /* --------------------------------------------------
       ACTIVE LINK HIGHLIGHT
       Marks the nav link whose data-nav-page matches
       the current filename.
    -------------------------------------------------- */
    function highlightActiveLink() {
        var page = currentPage() || "index.html";
        document.querySelectorAll("[data-nav-page]").forEach(function (link) {
            var matches = link.getAttribute("data-nav-page") === page;
            link.classList.toggle("active", matches);
            link.classList.toggle("text-orange", matches);
        });
    }

    /* --------------------------------------------------
       AUTH SLOT — swap Login ↔ User Dropdown
    -------------------------------------------------- */
    function renderAuthSlot() {
        var authItem = document.getElementById("nav-auth-item");
        if (!authItem) return;

        var user = getUser();

        if (user && user.loggedIn) {
            // ── Logged-in state: show user dropdown ──
            var displayName = user.name
                ? user.name.split(" ")[0]
                : user.email
                    ? user.email.split("@")[0]
                    : "Account";

            authItem.innerHTML = `
        <div class="nav-user-wrap dropdown">
          <button class="nav-user-btn dropdown-toggle" type="button"
            data-bs-toggle="dropdown" aria-expanded="false">
            <span class="nav-user-avatar"><i class="bi bi-person-circle"></i></span>
            <span class="nav-user-name">${displayName}</span>
          </button>
          <ul class="dropdown-menu dropdown-menu-end nav-user-dropdown shadow-sm">
            <li>
              <a class="dropdown-item" href="profile.html">
                <i class="bi bi-gear me-2 text-orange"></i>Profile
              </a>
            </li>
            <li><hr class="dropdown-divider" /></li>
            <li>
              <button class="dropdown-item text-danger" id="nav-logout-btn">
                <i class="bi bi-box-arrow-right me-2"></i>Logout
              </button>
            </li>
          </ul>
        </div>`;

            // Wire up logout
            var logoutBtn = document.getElementById("nav-logout-btn");
            if (logoutBtn) {
                logoutBtn.addEventListener("click", function () {
                    localStorage.removeItem("ht_auth_user");
                    // Clear destination cookies too
                    ["ht_last_dest", "ht_recent_dests"].forEach(function (name) {
                        document.cookie =
                            name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
                    });
                    // Brief toast if showToast is available, then redirect
                    if (typeof showToast === "function") {
                        showToast("👋 Logged out. See you soon!", "info", 2000);
                    }
                    setTimeout(function () {
                        window.location.href = "auth.html";
                    }, 800);
                });
            }
        }
        // Logged-out state: the default "Login" link already in the template is fine.
    }

    /* --------------------------------------------------
       SCROLL SHADOW on navbar
    -------------------------------------------------- */
    function initScrollShadow() {
        var navbar = document.getElementById("ht-navbar");
        if (!navbar) return;
        window.addEventListener("scroll", function () {
            navbar.classList.toggle("scrolled-nav", window.scrollY > 50);
        });
    }

    /* --------------------------------------------------
       MOBILE NAVBAR AUTO-CLOSE on link click
    -------------------------------------------------- */
    function initMobileClose() {
        document.querySelectorAll("#mainNav .nav-link").forEach(function (link) {
            link.addEventListener("click", function () {
                var collapse = document.getElementById("mainNav");
                if (collapse && collapse.classList.contains("show")) {
                    // Bootstrap 5
                    if (window.bootstrap && bootstrap.Collapse) {
                        var bs = bootstrap.Collapse.getInstance(collapse);
                        if (bs) bs.hide();
                    }
                }
            });
        });
    }

    /* --------------------------------------------------
       INJECT NAVBAR USER DROPDOWN STYLES
       Only injected once; scoped so they don't clash
       with any existing rules.
    -------------------------------------------------- */
    function injectDropdownStyles() {
        if (document.getElementById("ht-nav-user-style")) return;
        var s = document.createElement("style");
        s.id = "ht-nav-user-style";
        s.textContent = `
      .nav-user-btn {
        display: flex; align-items: center; gap: 7px;
        background: none; border: 1.5px solid #FF5722;
        border-radius: 30px; padding: 5px 14px 5px 8px;
        font-family: 'Poppins', sans-serif; font-size: .88rem;
        font-weight: 600; color: #FF5722; cursor: pointer;
        transition: all .22s ease;
      }
      .nav-user-btn:hover,
      .nav-user-btn.show { background: #FF5722; color: #fff; }
      .nav-user-btn::after { display: none; }
      .nav-user-avatar { font-size: 1.25rem; line-height: 1; }
      .nav-user-name {
        max-width: 90px; overflow: hidden;
        text-overflow: ellipsis; white-space: nowrap;
      }
      .nav-user-dropdown {
        border: 1.5px solid #f0f0f0; border-radius: 14px;
        padding: 8px; min-width: 160px;
        font-family: 'Poppins', sans-serif;
      }
      .nav-user-dropdown .dropdown-item {
        border-radius: 8px; font-size: .88rem;
        font-weight: 500; padding: 9px 14px;
        transition: background .18s;
      }
      .nav-user-dropdown .dropdown-item:hover { background: #fff3ef; }
      html.dark-mode .nav-user-dropdown {
        background: #1e1e1e; border-color: #2c2c2c;
      }
      html.dark-mode .nav-user-dropdown .dropdown-item { color: #ddd; }
      html.dark-mode .nav-user-dropdown .dropdown-item:hover { background: #2a2a2a; }
    `;
        document.head.appendChild(s);
    }

    /* --------------------------------------------------
       BOOT — run everything once the DOM is ready
    -------------------------------------------------- */
    function boot() {
        injectNavbar();
        injectDropdownStyles();
        highlightActiveLink();
        renderAuthSlot();
        initScrollShadow();
        initMobileClose();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot);
    } else {
        boot(); // already parsed (script loaded with defer near </body>)
    }
})();