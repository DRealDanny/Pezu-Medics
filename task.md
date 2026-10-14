# Task: Implement a Centered Editorial Hero Section with a Rectangular "Smooth Slide Wipe" Slideshow Above "Our Product Price"

## 1. Context & Codebase Inspection

Before writing code, inspect our project structure:

1. Check the main page component (where `CurtainReveal` and the `"Our Product Price"` section live) and inspect our existing styling pattern (`.module.css` / global CSS / Tailwind).
2. Locate the `"Our Product Price"` section container so we can place the new `<HeroSection />` directly above it and wire up a smooth-scroll anchor (`id="our-product-price"`).
3. Match our existing brand palette, typography, and the `cubic-bezier(0.76, 0, 0.24, 1)` luxury momentum curve used in `CurtainReveal.module.css`.

## 2. Layout Architecture: Centered Editorial + Wide Rectangular Frame

Create `HeroSection.js` and `HeroSection.module.css` using a clean **Centered Editorial** hierarchy:

### A. Top Centered Content Block

- **Eyebrow Pill Badge:** Subtle clinical badge centered at the top (e.g., `"TRUSTED CLINICAL & LABORATORY SUPPLY PARTNER"`).
- **Main Heading (`h1`):** High-contrast, authoritative centered headline:
  `"Certified Medical Equipment & Consumables, Priced Transparently."`
- **Subheading (`p`):** Centered, constrained width (`max-width: 680px`) for effortless reading:
  `"Equipping hospitals, diagnostic centers, and clinics with verified surgical instruments, rapid diagnostics, and essential medical supplies—ready for fast dispatch."`
- **CTA Action Row:**
  - Primary Button: `"Explore Our Product Prices ↓"` — clicking this smoothly scrolls the user directly to `#our-product-price` (with an appropriate `scroll-margin-top` so the section header lands cleanly in view).
  - Users can also naturally scroll past the hero straight into the catalog with zero scroll-jacking.

### B. Bottom Wide Rectangular Slideshow Container

- Below the CTA button, render a wide **rectangular landscape frame** (`max-width: 1160px`, `width: 100%`, `aspect-ratio: 16 / 8` on desktop, `aspect-ratio: 16 / 10` on tablet/mobile) with rounded corners (`border-radius: 16px` to `24px`), `overflow: hidden`, and a subtle premium border/elevation.
- Define an easy-to-edit `HERO_SLIDES` array at the top of `HeroSection.js` with **4 landscape placeholder images** (use clean, high-resolution medical/surgical/laboratory landscape placeholder URLs that I can easily replace with my own rectangular photos later), each with a subtle corner caption badge (e.g., `"01 / Diagnostic & Monitoring Equipment"`, `"02 / Surgical & Theatre Instruments"`, `"03 / Laboratory & Rapid Testing"`, `"04 / Hospital Consumables & Disposables"`).

## 3. Slideshow Mechanics: GPU "Smooth Slide Wipe" Transition

- **Smooth Slide Wipe:** Transition between the 4 rectangular slides every `4.5s` using a horizontal wipe/slide transition driven strictly by GPU compositor transforms (`translate3d` + `cubic-bezier(0.76, 0, 0.24, 1)` over `0.85s`).
- **Inner Parallax Polish:** As the incoming slide wipes across from `translate3d(100%, 0, 0)` to `translate3d(0, 0, 0)`, add a subtle counter-scale/parallax on the inner image (`scale(1.06)` settling to `scale(1)`) so the wipe feels editorial and high-end rather than a flat carousel shift.
- **Interactive Controls:**
  - Render 4 sleek segmented progress bars at the bottom of the rectangular image frame that fill smoothly over the `4.5s` interval and allow clicking to jump to any slide.
  - Include Previous / Next arrow buttons and touch-swipe support on mobile.
  - Pause the auto-advance timer when the user hovers over the slideshow frame.

## 4. Curtain-to-Hero Choreography & Locked 60–120 FPS Performance

- **Synchronized Entrance with `CurtainReveal`:** Use pure CSS compositor keyframes (`translate3d` and `opacity` with `cubic-bezier(0.76, 0, 0.24, 1)`) staggered with small `animation-delay` offsets (`0.35s` for eyebrow/heading, `0.45s` for subheading/CTA, `0.55s` for the rectangular slideshow frame) so the Hero glides into place right as the 4 curtain columns lift on page reload.
- **Strict Layer Isolation (Protect the 319 Product Cards Below):** Apply `isolation: isolate; contain: layout paint; transform: translateZ(0);` to the rectangular slideshow container so the ongoing 4.5-second slide wipes never trigger layout recalculations or repaints on the 319 product cards in `"Our Product Price"` below.
- **Image Optimization:** Set the first slide image to `loading="eager"` and `fetchPriority="high"` so it is immediately ready when the curtain opens, and lazy-preload slides 2–4.
- **Responsive Across All Screens:** Ensure fluid typography (`clamp()`), comfortable padding on mobile viewports, and respect `prefers-reduced-motion: reduce`.
