# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start Vite dev server with HMR
npm run build      # Production build to dist/
npm run preview    # Preview production build locally
npm run lint       # ESLint (flat config, React hooks + refresh plugins)
```

Utility scripts (require environment variables):
```bash
node generate-covers.mjs   # Generate blog cover images via Gemini API (needs GEMINI_API_KEY)
node fetch-portfolio.mjs   # Sync portfolio data from Supabase
```

No test framework is configured.

## Architecture

**Stack:** React 19 + Vite 7 + Tailwind CSS 3.4 + GSAP 3.14 + Lenis smooth scroll

**Routing (react-router-dom, SPA):**
- `/` → HomePage (composes Hero, ClientLogos, Features, Philosophy, Testimonials, BlogPreview, Protocol, ContactForm)
- `/blog` → BlogList
- `/blog/:slug` → BlogPost
- `/portfolio/:slug` → PortfolioDetail

**Entry flow:** `main.jsx` → BrowserRouter + HelmetProvider → App → Preloader → CustomCursor (desktop) → Navbar → ScrollToHash → Routes → Footer

**Lenis smooth scroll** wraps content only on the home page (`isHome` check in App.jsx). Blog and portfolio routes use native scroll.

## Blog System (MDX)

Posts live in `src/content/blog/*.mdx`. Each file exports frontmatter as a named export:

```js
export const frontmatter = {
  title: "English Title",
  titleHe: "Hebrew Title",
  slug: "url-slug",
  date: "2026-02-20",
  excerpt: "...",
  excerptHe: "...",
  tags: ["AI", "Product"],
  coverImage: "/blog/cover.jpg",
  lang: "both"  // "en", "he", or "both"
}
```

`src/utils/blog.js` uses `import.meta.glob('../content/blog/*.mdx', { eager: true })` to load all posts at build time. The MDX default export becomes a React component; frontmatter is accessed via the named export.

**Bilingual approach:** No i18n library. Components use local `[lang, setLang]` state with conditional rendering and `dir="rtl"` for Hebrew. Both languages coexist in a single MDX file.

## Animation Patterns

All GSAP animations must use `gsap.context()` scoped to a container ref for proper cleanup:

```js
useEffect(() => {
  const ctx = gsap.context(() => {
    gsap.from('.target', { y: 40, opacity: 0, stagger: 0.08 });
  }, containerRef);
  return () => ctx.revert();
}, []);
```

ScrollTrigger instances are killed on route changes in App.jsx. Key animation patterns used throughout:
- Entrance staggers (Hero, BlogList cards)
- Scroll-triggered reveals (Features, Philosophy word-reveal)
- Stacking cards with blur (Protocol)
- Magnetic button wrapper (MagneticWrap component)
- Custom cursor with dual rings (desktop only)

## Design System

**Colors (4 only):**
- `black` (#111111) — primary text, dark backgrounds
- `signal-red` (#E63B2E) — accent, CTAs, highlights
- `paper` (#E8E4DD) — secondary shapes, beige
- `off-white` (#F5F3EE) — light backgrounds, cards

**Fonts (loaded via Google Fonts in index.html):**
- `font-sans` → Space Grotesk (body, UI)
- `font-serif` → DM Serif Display (headlines)
- `font-mono` → Space Mono (labels, code)

**Visual style:** Architectural, Swiss-design inspired, minimal, editorial, geometric. Background uses an SVG noise texture overlay at 5% opacity (defined in index.html).

See `DESIGN_SYSTEM.md` for AI image generation prompt templates (Gemini 3 Pro).

## Key Conventions

- **ESLint rule:** Unused variables are allowed if uppercase or prefixed with `_` (`varsIgnorePattern: '^[A-Z_]'`)
- **No state management library** — local useState/useRef only
- **SEO:** react-helmet-async; each page sets its own meta tags
- **Contact form:** Web3Forms integration in ContactForm.jsx (API key placeholder needs replacing)
- **Portfolio data:** JSON in `src/data/portfolio.json`, loaded via `src/utils/portfolio.js`
- **Responsive:** Mobile-first with Tailwind breakpoints (md: 768px, lg: 1024px)
- **Typography plugin:** `@tailwindcss/typography` provides `prose` classes for blog content
