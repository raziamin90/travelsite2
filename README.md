# Hero Travel 🌍
A responsive travel agency landing page built with HTML, CSS, and vanilla JavaScript.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap_5.3-7952B3?style=flat&logo=bootstrap&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

---

## Tech Stack
| Technology | Purpose |
|---|---|
| HTML5 | Semantic page structure |
| CSS3 (Custom Properties, Flexbox, Grid) | Layout and styling |
| Bootstrap 5.3 | Responsive grid, carousel, utilities |
| Bootstrap Icons | Icon set |
| Google Fonts (Poppins) | Typography |
| Vanilla JavaScript | Interactivity, modals, validation |

---

## Project Structure
```
hero-travel/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
└── assests/
    └── images/
        ├── logo.svg
        ├── Rectangle-1.jpg         # Hero background
        ├── Rectangle-4.jpg         # Carousel slide 1
        ├── popular tours.jpg        # Carousel slide 2
        ├── Rectangle-8.jpg          # Carousel slide 3 / Newsletter
        ├── maldives.jpg
        ├── indonesia.jpg
        ├── SriLanka.jpg
        ├── Rectangle-7.jpg          # North America
        ├── Kashmir.jpg
        ├── bangladesh.jpg
        ├── bandarban.jpg
        ├── Rectangle-122.jpg        # Deal card 1 (Santorini)
        ├── Rectangle-12.jpg         # Deal card 2 (Bali)
        ├── satorini1.jpg            # Deal card 3 (Santorini)
        ├── videoiamge.jpg           # Video section preview
        ├── hotel.png                # Why Choose Us icon
        ├── map.png                  # Why Choose Us icon
        └── price-tag.png            # Why Choose Us icon
```

---

## Sections
| Section | Description |
|---|---|
| **Navbar** | Sticky with scroll shadow effect and active link highlight. Auto-closes on mobile. |
| **Hero** | Full background image with search bar — destination, month, and trip type filters with validation |
| **Popular Tours** | Auto-sliding Bootstrap carousel with feature checklist |
| **Destinations** | Masonry-style destination card grid with click-to-open detail modals |
| **Why Choose Us** | Three feature cards — Hotels, Service, Price Guarantee |
| **Deals & Discounts** | Full-bleed image cards with frosted glass overlay and booking modal |
| **Video** | Preview image with YouTube embed modal player |
| **Newsletter** | Region-based rotating text carousel with subscribe form validation |
| **Footer** | Social links and copyright |

---

## JavaScript Features
1. Sticky navbar — adds shadow class after 50px scroll
2. Active nav link updates based on current scroll position
3. Mobile navbar auto-closes on link click
4. Smooth scroll for all anchor links with navbar offset guard
5. Search bar validation with shake animation and toast feedback
6. Destination card click → detail modal (description, highlights, price)
7. "Book Now" → multi-field booking form modal with validation
8. Newsletter region dropdown with rotating carousel text per region
9. Subscribe form validation with animated success state
10. Scroll-to-top button fades in after 400px scroll
11. Section fade-in animation on scroll using IntersectionObserver
12. Toast notification system (success / error / info)

---

## Bug Fixes Applied
- **`querySelector('#')` crash** — added guard to skip bare `#` href links in smooth scroll handler
- **Duplicate carousel ID** — renamed newsletter carousel from `#tourCarousel` to `#newsletterCarousel` to prevent Bootstrap JS conflict
- **Script blocking** — added `defer` to Bootstrap JS and `script.js` to prevent render blocking
- **Image loading latency** — added `loading="lazy"` to all below-the-fold images
- **CDN preconnect** — added `preconnect` hint for `cdn.jsdelivr.net` to reduce DNS lookup time

---

## Performance Notes
- Hero image loads eagerly; all other images use `loading="lazy"`
- Bootstrap JS and custom JS both load with `defer` — page renders before scripts execute
- `preconnect` hints added for Google Fonts and Bootstrap CDN
- IntersectionObserver used for scroll animations (no scroll event polling)

---

## Getting Started
No build tools or dependencies required. Just open `index.html` in a browser.

```bash
# Clone the repo
git clone https://github.com/raziamin90/travelsite2.git

# Open in browser
open index.html
```

> **Note:** The `#testimonial` anchor warning in the browser console only appears when opening via `file://`. It disappears when served from localhost or any web server.

---

## Color Palette
| Name | Hex | Usage |
|---|---|---|
| Primary Orange | `#FF5722` | Buttons, highlights, badges |
| Primary Dark | `#e64a19` | Button hover states |
| Primary Light | `#fff3ef` | Card backgrounds, badges |
| Text Dark | `#1a1a2e` | Headings and body text |
| Text Muted | `#6c757d` | Descriptions and captions |
| White | `#ffffff` | Backgrounds, overlays |

---

## Browser Support
Works in all modern browsers (Chrome, Firefox, Edge, Safari). No build tools, no dependencies, no framework required.
