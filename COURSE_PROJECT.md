# 10 Days 10 Skills — Claude Code Course

## Project Overview

A paid course teaching Claude Code skills in 10 days (20-30 minute lessons each). Course sold through external LMS (Schooler), managed through bestguy.ai website.

**Course URL:** https://my.schooler.biz/s/112677/Claudecodeskills
**Landing Page:** https://bestguy.ai/course/10-days-10-skills
**Presale Page:** https://10d10s-presale.netlify.app
**Course Hub (email-gated):** https://bestguy.ai/course/hub
**Admin Dashboard:** https://bestguy.ai/admin/course
**Slide Presentations:** https://guyaga-slides.netlify.app
**Thank You Page:** https://bestguy.ai/course/thank-you.html
**WhatsApp Group:** https://chat.whatsapp.com/IpQ2tlxi8RTKRMMvoKDkUl

---

## Current Lesson Order (FINAL — Days 4/5 were swapped)

| Day | Skill | Service | Repo | Guide |
|-----|-------|---------|------|-------|
| Intro A | Getting Started | Claude Code | No repo | Slides only |
| Intro B | Understanding Skills | Skills System | No repo | Slides only |
| 1 | Image Generation | Gemini 3 Pro | [day01](https://github.com/guyaga/10d10s-day01-image-generation) | `day01-image-generation.html` |
| 2 | AI Video Analyzer | Gemini 3.1 Pro | [day02](https://github.com/guyaga/10d10s-day02-video-analyzer) | `day02-video-analyzer.html` |
| 3 | AI Video Editor | ffmpeg + yt-dlp | [day03](https://github.com/guyaga/10d10s-day03-video-editor) | `day03-video-editor.html` |
| 4 | AI Video Generation | fal.ai MCP | [day04](https://github.com/guyaga/10d10s-day04-video-generation) | `day04-video-generation.html` |
| 5 | AI Voice & Audio | ElevenLabs | [day05](https://github.com/guyaga/10d10s-day05-voice-audio) | `day05-voice-audio.html` |
| 6 | Web Intelligence | Firecrawl | [day06](https://github.com/guyaga/10d10s-day06-web-intelligence) | `day06-web-intelligence.html` |
| 7 | Social Media | Upload Post | [day07](https://github.com/guyaga/10d10s-day07-social-media) | `day07-social-media.html` |
| 8 | WhatsApp Messaging | Green API | [day08](https://github.com/guyaga/10d10s-day08-whatsapp) | `day08-whatsapp.html` |
| 9 | AI Presentations | python-pptx + Gemini | [day09](https://github.com/guyaga/10d10s-day09-presentations) | `day09-presentations.html` |
| 10 | Build & Deploy | React + Netlify | [day10](https://github.com/guyaga/10d10s-day10-landing-page) | `day10-landing-page.html` |

**Note:** Days 4 and 5 were swapped (Video Gen before Voice/Audio). Repos and guide filenames have been renamed to match the new lesson order (GitHub auto-redirects old URLs).

---

## Architecture

### Main Website (bestguy.ai)
- **Stack:** React 19 + Vite 7 + Tailwind CSS 3.4 + GSAP + Supabase
- **Hosting:** Netlify — `npx netlify deploy --prod --dir=dist`
- **Repo:** https://github.com/guyaga/new-website

### Course System
- **Landing Page** (`/course/10-days-10-skills`) — Redesigned presale page with honest messaging, "who is this for/not for" section, transparent pricing, skills pipeline grouped by Create/Manage/Build
- **Course Hub** (`/course/hub`) — Email-gated dashboard, standalone (no site navbar/footer), 3 tabs (Lessons/Resources/About)
- **Thank You** (`/course/thank-you.html`) — Post-purchase page with WhatsApp group link, hub link, slides link, presale notice
- **Admin** (`/admin/course`) — Session manager with expandable details, lock/unlock + Resend email
- **Admin Members** (`/admin/course/members`) — Add/edit/remove members, phone field, CSV export, welcome email

### Supabase (BestGuy project: `lvwewkpytqwlxxcefqdw`)
- **Tables:** `course_sessions` (12 rows: day -1 to 10), `course_members`
- **Edge Function:** `send-course-email` — Resend proxy (welcome + unlock emails)
- **RLS:** Public can read sessions + check membership. Auth can manage everything.
- **Secrets:** `RESEND_API_KEY`, `RESEND_FROM` set on Supabase Edge Functions

### Slide Presentations (guyaga-slides.netlify.app)
- **Stack:** React + Vite + Tailwind + Framer Motion
- **Project:** `D:/Website/guyaga-slides/`
- **Site ID:** `dff131a9-4edf-4f71-be2f-4047fd39ac53`
- **Features:** 12 presentations (Intro A, Intro B, Days 1-10), keyboard nav (RTL-aware), overview mode, fullscreen, teleprompter with auto-scroll + settings
- **Teleprompter:** Press T — popup window with speed control, scroll direction toggle, font size, guide line, reset button, settings panel
- **RTL:** Left arrow = next in Hebrew, right arrow = previous. Visual transitions flip.
- **Hebrew notes:** All 193 slides have Hebrew teleprompter notes filled in

### Presale Page (10d10s-presale.netlify.app)
- **Project:** `D:/Website/course-repos/course-presale/`
- **Site ID:** `573eae70-52cd-43fa-9107-33c9fa3f222a`
- **Standalone React page** with same design as updated landing page

### Demo Landing Pages
- AI Consulting: https://ai-consulting-guyaga.netlify.app
- Fitness Coach: https://fitness-coach-maya.netlify.app (with AI-generated on-brand images)

---

## Key Design Decisions

### Landing Page Philosophy
- **Honest, not hype** — "I'll give you tools to create better with Claude Code"
- **No overpromising** — clear "not for everyone" section with who should/shouldn't take the course
- **Transparent pricing** — Claude Max $100/mo + ~$50 API costs, shown upfront
- **Skills grouped** as pipeline: Create (Days 1-5) → Manage & Publish (Days 6-8) → Build & Deploy (Days 9-10)
- **Presale messaging** — course updating, full version by 14.7.2026

### Pricing (IMPORTANT)
- **Gemini API:** Pay-as-you-go. $0.134/2K image, $0.24/4K. NO "free tier" language anywhere.
- **Upload Post:** ~$25 for 5 brands (each brand = up to 11 platforms)
- **fal.ai:** Pay per second of video ($0.07-$0.40/s depending on model)
- **ElevenLabs:** Free tier exists for learning, paid for production
- **Green API:** ~$12/mo per instance, free tier for testing
- **Course access:** 1 year (not lifetime)

### Hebrew Support
- Hebrew font: Heebo (primary for RTL), Frank Ruhl Libre (serif)
- `font-mono` in RTL uses Heebo with letter-spacing (Space Mono doesn't support Hebrew)
- CSS: `[dir="rtl"]` overrides in index.css
- "מיומנויות" replaced with "סקילים" everywhere
- All slide presentations have bilingual EN/HE content + Hebrew teleprompter notes

### fal.ai MCP Installation (IMPORTANT)
Two-step process — documented in skill, README, guide, slides, Supabase:
1. Run `claude mcp add --transport http fal-ai https://mcp.fal.ai/mcp --header "Authorization: Bearer YOUR_KEY" --scope user` in TERMINAL (not inside Claude Code). The **`--scope user`** flag is critical — it installs the MCP globally so it's available in every project. Without it, the MCP only works in the current folder, and students will lose access when they open a different project.
2. Verify in Antigravity via `/` menu → **mcp servers** → look for `fal-ai` ✓ Connected. Gold-standard check: open a different project folder and verify it's still there.
3. Restart Claude Code / start a new conversation, then paste skill install prompt.

---

## File Locations

### Course Components
```
src/pages/CoursePage.jsx              — Landing page (redesigned presale style)
src/pages/CourseHub.jsx               — Email-gated hub (standalone, no navbar)
src/pages/admin/CourseAdmin.jsx       — Session manager (expandable details)
src/pages/admin/CourseMembersAdmin.jsx — Members (edit, phone, CSV, welcome email)
src/components/course/                 — All course components
src/utils/course.js                   — Supabase queries + edge function email
```

### Course Assets
```
public/course/hero.jpg                — Hero image (B&W photo + typography)
public/course/cover.jpg               — Combined HE/EN cover
public/course/instructor.jpg          — Guy's photo
public/course/og-image.jpg            — Social share image
public/course/thank-you.html          — Post-purchase page
public/course/guides/                  — HTML guides per day (Hebrew, branded)
public/course/examples/                — Cover images per day + example outputs
public/course/landing-*.jpg            — Landing page visual assets
```

### Skill Repos (local)
```
course-repos/10d10s-day01-image-generation/
course-repos/10d10s-day02-video-analyzer/
course-repos/10d10s-day03-video-editor/
course-repos/10d10s-day04-video-generation/
course-repos/10d10s-day05-voice-audio/
course-repos/10d10s-day06-web-intelligence/
course-repos/10d10s-day07-social-media/
course-repos/10d10s-day08-whatsapp/
course-repos/10d10s-day09-presentations/
course-repos/10d10s-day10-landing-page/
course-repos/course-presale/                  — Standalone presale page
course-repos/ai-consulting-demo/              — Demo landing page
course-repos/fitness-coach-demo/              — Demo with AI images
```

### Installed Skills (Claude Code)
```
~/.claude/skills/nano-banano-pro/          — Day 1 (image gen)
~/.claude/skills/ai-video-analyzer/        — Day 2 (video analysis)
~/.claude/skills/ai-video-editor/          — Day 3 (ffmpeg)
~/.claude/skills/fal-ai-video-generation/  — Day 4 (video gen via MCP)
~/.claude/skills/ai-voice-audio/           — Day 5 (ElevenLabs)
~/.claude/skills/web-intelligence/         — Day 6 (Firecrawl)
~/.claude/skills/social-media-publisher/   — Day 7 (Upload Post)
~/.claude/skills/whatsapp-messenger/       — Day 8 (Green API)
~/.claude/skills/pptx-ai-presentations/    — Day 9 (PPTX)
~/.claude/skills/landing-page-builder/     — Day 10 (React + Netlify)
```

### Slide Presentations
```
guyaga-slides/src/data/lessons/intro-a.js   — Getting Started (13 slides)
guyaga-slides/src/data/lessons/intro-b.js   — Understanding Skills (13 slides)
guyaga-slides/src/data/lessons/day01.js     — Image Generation (20 slides)
guyaga-slides/src/data/lessons/day02.js     — Video Analyzer (20 slides)
guyaga-slides/src/data/lessons/day03.js     — Video Editor (20 slides)
guyaga-slides/src/data/lessons/day04.js     — Video Generation (20 slides, was day05)
guyaga-slides/src/data/lessons/day05.js     — Voice & Audio (20 slides, was day04)
guyaga-slides/src/data/lessons/day06-10.js  — Days 6-10 (20 slides each)
guyaga-slides/src/data/collections.js       — Dashboard listing
guyaga-slides/src/pages/Presentation.jsx    — Slide engine + teleprompter
guyaga-slides/src/components/SlideRenderer.jsx — 12 slide type components
```

---

## Social Media Assets (local)

```
D:/Website/course-social-he.jpg        — Course announcement HE
D:/Website/course-social-en.jpg        — Course announcement EN
D:/Website/presale-he.jpg              — Presale clean HE
D:/Website/presale-en.jpg              — Presale clean EN
D:/Website/presale-urgent-he.jpg       — Presale urgent HE (bold red slashes)
D:/Website/presale-urgent-en.jpg       — Presale urgent EN (bold red slashes)
D:/Website/presale-v2-he.jpg           — Presale v2 HE
D:/Website/presale-v2-en.jpg           — Presale v2 EN
D:/Website/presale-story-he.jpg        — Story format HE
D:/Website/presale-story-en.jpg        — Story format EN
```

---

## Brand Assets

- **Logo:** `My image and logo/logo.png` (white Guyaga script)
- **Photo:** `My image and logo/me.jpg` (Guy's headshot)
- **Colors:** Black #111111, Signal Red #E63B2E, Paper #E8E4DD, Off-White #F5F3EE
- **Fonts:** Space Grotesk (sans), DM Serif Display (serif), Space Mono (mono), Heebo (Hebrew), Frank Ruhl Libre (Hebrew serif)
- **Image generation:** Always 2K minimum. Use nano-banano-pro skill with brand color preamble.

---

## Deploy Commands

```bash
# Main website (bestguy.ai)
cd D:/Website && npm run build && npx netlify deploy --prod --dir=dist

# Slide presentations
cd D:/Website/guyaga-slides && npm run build && npx netlify deploy --prod --dir=dist --site dff131a9-4edf-4f71-be2f-4047fd39ac53

# Presale page
cd D:/Website/course-repos/course-presale && npm run build && npx netlify deploy --prod --dir=dist --site 573eae70-52cd-43fa-9107-33c9fa3f222a

# Push a course repo to GitHub
cd D:/Website/course-repos/10d10s-dayXX-name && git add -A && git commit -m "message" && git push origin master
```

---

## Supabase Access

- **Project:** BestGuy (`lvwewkpytqwlxxcefqdw`)
- **MCP:** Use `/mcp` command to authenticate, then `mcp__supabase__execute_sql`
- **Anon key:** In `.env` as `VITE_SUPABASE_ANON_KEY` (read-only for public)
- **Edge Function:** `send-course-email` handles Resend emails (avoids CORS)

---

## Course Timeline

- **Presale:** Active now
- **Full course available:** By 14.7.2026
- **Zoom help sessions:** Dates posted in WhatsApp group
- **Access duration:** 1 year for hub materials. Skills/repos are permanent.

---

## Key Feedback & Rules (from this session)

1. **Test before documenting** — always verify API calls work before writing skill docs
2. **No "free tier" for Gemini** — use pay-as-you-go language, recommend billing profile
3. **Upload Post:** $25 for 5 brands (not channels), each brand up to 11 platforms
4. **fal.ai MCP:** Two-step install (terminal first, NOT inside Claude Code)
5. **Hebrew:** Use "סקילים" not "מיומנויות". Heebo font for all Hebrew. font-mono override for RTL.
6. **No personal API keys in repos** — only placeholders
7. **Landing page tone:** Honest, practical, no overpromising. "I'll give you the tools" not "transform your life"
8. **Course not for beginners** — clear expectations section for who should/shouldn't enroll
9. **Slide presentations:** Hebrew notes filled, RTL-aware navigation (left=next in Hebrew)
10. **Image generation:** Always 2K minimum, brand color preamble in every prompt
