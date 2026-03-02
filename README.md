# AGA Digital — Portfolio & Blog

Personal website for Guy Aga / AGA Digital — a portfolio site and bilingual blog built with React, Vite, and GSAP animations.

## Tech Stack

- **React 19** — UI framework
- **Vite 7** — Build tool with HMR
- **Tailwind CSS 3.4** — Utility-first styling with `@tailwindcss/typography`
- **GSAP 3.14** — Scroll-triggered animations and transitions
- **Lenis** — Smooth scroll (home page)
- **MDX** — Blog posts with JSX support (`@mdx-js/rollup`)
- **react-router-dom** — Client-side SPA routing
- **react-helmet-async** — SEO meta tags

## Features

- Swiss-design inspired, minimal editorial aesthetic
- Bilingual support (English / Hebrew) with RTL layout
- MDX-powered blog with cover images and tag filtering
- Portfolio showcase with detail pages
- GSAP scroll animations (stacking cards, word reveals, magnetic buttons)
- Custom cursor (desktop)
- Preloader animation
- Contact form via Web3Forms
- Fully responsive (mobile-first)

## Getting Started

### Prerequisites

- **Node.js** 18+ (recommended: 20+)
- **npm** 9+

### Install

```bash
git clone https://github.com/guyaga/new-website.git
cd new-website
npm install
```

### Development

```bash
npm run dev
```

Opens a local dev server at `http://localhost:5173` with hot module replacement.

### Production Build

```bash
npm run build
```

Outputs optimized static files to the `dist/` directory.

### Preview Build

```bash
npm run preview
```

Serves the production build locally for testing before deployment.

### Lint

```bash
npm run lint
```

Runs ESLint with React hooks and refresh plugins.

## Project Structure

```
├── public/
│   ├── blog/              # Blog cover images
│   ├── portfolio/         # Portfolio project images
│   └── hero-bg.jpg        # Hero background
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Hero.jsx
│   │   ├── Navbar.jsx
│   │   ├── Features.jsx
│   │   ├── Philosophy.jsx
│   │   ├── Protocol.jsx
│   │   ├── ContactForm.jsx
│   │   ├── Footer.jsx
│   │   └── ...
│   ├── content/blog/      # MDX blog posts
│   ├── data/              # Portfolio JSON data
│   ├── pages/             # Route-level page components
│   │   ├── HomePage.jsx
│   │   ├── BlogList.jsx
│   │   ├── BlogPost.jsx
│   │   └── PortfolioDetail.jsx
│   └── utils/             # Blog and portfolio loaders
├── index.html             # Entry HTML with font imports
├── tailwind.config.js
├── vite.config.js
└── package.json
```

## Routes

| Path | Page | Description |
|------|------|-------------|
| `/` | HomePage | Hero, client logos, features, philosophy, testimonials, blog preview, protocol, contact |
| `/blog` | BlogList | All blog posts with language toggle |
| `/blog/:slug` | BlogPost | Individual post with EN/HE toggle |
| `/portfolio/:slug` | PortfolioDetail | Portfolio project detail page |

## Design System

**Colors:**
- `#111111` — Black (primary text, dark backgrounds)
- `#E63B2E` — Signal Red (accent, CTAs)
- `#E8E4DD` — Paper (secondary shapes, beige)
- `#F5F3EE` — Off-White (light backgrounds)

**Fonts (Google Fonts):**
- Space Grotesk — Body, UI
- DM Serif Display — Headlines
- Space Mono — Labels, code

## Utility Scripts

These optional scripts require environment variables:

```bash
# Generate blog cover images via Gemini API
GEMINI_API_KEY=your_key node generate-covers.mjs

# Sync portfolio data from Supabase
node fetch-portfolio.mjs
```

## License

Private project — all rights reserved.
