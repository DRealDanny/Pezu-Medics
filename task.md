# Task: Implement a Lightweight 4-Column Staggered Curtain Initial Load Reveal (GSAP + Next.js)

## 1. Context & Codebase Inspection

Before making changes:

1. Check `package.json` for `gsap` and `@gsap/react`. Install them if missing.
2. Inspect our styling setup (Tailwind CSS / global CSS) and primary brand palette so the curtain columns use our primary dark/surface background color.
3. Locate the main entry file (`app/page.tsx` or `app/layout.tsx`) for this one-page site.

## 2. Build `<CurtainReveal />` (`components/CurtainReveal.tsx`)

Create a lightweight client component (`"use client"`) that triggers once every time the page loads or reloads.

### Zero-Flash SSR Initial State (Crucial)

- Render the 4 vertical columns at their covered starting position (`translateY(0%)`) directly in the initial JSX/CSS so the screen is already covered on Server-Side Render (SSR) from millisecond zero—preventing any Flash of Unstyled Content (FOUC) on page reload before JS hydrates.

### GSAP Animation Specs

- Use `useGSAP` from `@gsap/react` scoped to the container ref.
- Animate the 4 columns upward off-screen using GPU-accelerated `yPercent: -100`.
- **Timing Configuration:**
  - `duration: 0.85`
  - `stagger: 0.12` (left-to-right across the 4 cuts)
  - `delay: 0.1`
  - `ease: "expo.inOut"`

## 3. Extreme Performance & Complete DOM Unmount

- **Zero Layout Shift:** Style the wrapper with `fixed inset-0 z-[9999] pointer-events-none overflow-hidden grid grid-cols-4 w-full h-[100dvh] min-h-screen`.
- **Self-Destruct on Complete:** Because this is a one-page website and the animation only runs on initial load/reload, use an `onComplete` callback in the GSAP tween to set `const [isDone, setIsDone] = useState(false)` -> `setIsDone(true)`. When `isDone` is `true`, return `null` so the component completely unmounts from the DOM and uses zero memory or GPU layers afterwards.
- **Hardware Acceleration:** Apply `will-change-transform` and `backface-visibility: hidden` to each column while active.
- **Accessibility:** Respect `prefers-reduced-motion: reduce` by immediately unmounting or doing a fast 0.15s opacity fade if enabled.

## 4. All-Screen Responsiveness & Visual Polish

- **Mobile Viewport Fix:** Use `h-[100dvh]` with `min-h-screen` fallback so mobile Safari and Chrome address bars never leave a gap at the bottom of the curtain.
- **Sub-Pixel Seam Fix:** Apply `scale-x-[1.01]` (or a `-1px` horizontal margin overlap) on each of the 4 columns so high-DPI mobile and Retina displays never show 1px vertical hairline gaps between the cuts before they slide up.

## 5. Integration

- Mount `<CurtainReveal />` at the top of our main page (`app/page.tsx` or `app/layout.tsx`).
- Verify there are no React hydration warnings or TypeScript errors.
