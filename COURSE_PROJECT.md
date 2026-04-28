# 10 Days 10 Skills — Claude Code Course

## Project Overview

A paid course teaching 10 Claude Code skills in 10 days (20-minute lessons each). The course is sold through an external LMS (Schooler) and managed through the bestguy.ai website.

**Course URL:** https://my.schooler.biz/s/112677/Claudecodeskills
**Landing Page:** https://bestguy.ai/course/10-days-10-skills
**Course Hub (email-gated):** https://bestguy.ai/course/hub
**Admin Dashboard:** https://bestguy.ai/admin/course

---

## Current Status (8/10 Days Complete)

| Day | Skill | Service | Repo | Guide |
|-----|-------|---------|------|-------|
| 1 | Image Generation | Gemini 3 Pro | [day01](https://github.com/guyaga/10d10s-day01-image-generation) | `/course/guides/day01-image-generation.html` |
| 2 | AI Video Analyzer | Gemini 3.1 Pro | [day02](https://github.com/guyaga/10d10s-day02-video-analyzer) | `/course/guides/day02-video-analyzer.html` |
| 3 | AI Video Editor | ffmpeg + yt-dlp | [day03](https://github.com/guyaga/10d10s-day03-video-editor) | `/course/guides/day03-video-editor.html` |
| 4 | AI Voice & Audio | ElevenLabs | [day04](https://github.com/guyaga/10d10s-day04-voice-audio) | `/course/guides/day04-voice-audio.html` |
| 5 | AI Video Generation | fal.ai MCP | [day05](https://github.com/guyaga/10d10s-day05-video-generation) | `/course/guides/day05-video-generation.html` |
| 6 | Web Intelligence | Firecrawl | [day06](https://github.com/guyaga/10d10s-day06-web-intelligence) | `/course/guides/day06-web-intelligence.html` |
| 7 | Social Media | Upload Post | [day07](https://github.com/guyaga/10d10s-day07-social-media) | `/course/guides/day07-social-media.html` |
| 8 | WhatsApp Messaging | Green API | [day08](https://github.com/guyaga/10d10s-day08-whatsapp) | `/course/guides/day08-whatsapp.html` |
| 9 | TBD | — | — | — |
| 10 | TBD | — | — | — |

---

## Architecture

### Website (bestguy.ai)
- **Stack:** React 19 + Vite 7 + Tailwind CSS 3.4 + GSAP + Supabase
- **Hosting:** Netlify (deployed via CLI: `npx netlify deploy --prod --dir=dist`)
- **Repo:** https://github.com/guyaga/new-website

### Course System
- **Landing Page** (`/course/10-days-10-skills`) — Public marketing page with hero, skills grid, pricing, FAQ
- **Course Hub** (`/course/hub`) — Email-gated dashboard for enrolled members (separate from PublicLayout — no site navbar/footer)
- **Admin** (`/admin/course`) — Session manager with expandable details, lock/unlock, email notifications
- **Admin Members** (`/admin/course/members`) — Add/edit/remove members, phone field, CSV export, welcome email

### Supabase (BestGuy project: `lvwewkpytqwlxxcefqdw`)
- **Tables:** `course_sessions` (10 rows), `course_members` (enrolled emails)
- **Edge Function:** `send-course-email` — handles Resend emails (welcome + unlock notifications)
- **RLS:** Public can read sessions + check membership email. Auth can manage everything.

### Email (Resend)
- **Domain:** bestguy.ai (verified)
- **From:** Guy Aga <guy@bestguy.ai>
- **Edge Function** proxies all emails to avoid CORS (frontend → Supabase Edge Function → Resend API)

---

## How to Create a New Lesson (Day 9, 10, etc.)

### Step-by-Step Process

1. **Plan the skill** — what service, what API, what the user can do
2. **Test the API** — verify it actually works before documenting (run real API calls)
3. **Create the skill file** (`~/.claude/skills/{skill-name}/SKILL.md`)
4. **Create the GitHub repo** (`course-repos/10d10s-day{XX}-{name}/`)
   - `SKILL.md` — the actual Claude Code skill file (no personal data!)
   - `README.md` — beginner-friendly guide with badges
   - `.env.example` — placeholder API keys
   - `cover.jpg` — generated with Nano Banana Pro
5. **Create the HTML guide** (`public/course/guides/day{XX}-{name}.html`) — Hebrew, branded dark theme
6. **Generate cover image** — brand style, no day numbers, skill topic + service name
7. **Push to GitHub** — public repo
8. **Update Supabase** — name, description, service, URLs, install prompt, examples
9. **Commit + push website** — guide + cover to git
10. **Deploy** — `npm run build && npx netlify deploy --prod --dir=dist`

### Key Rules

- **NO personal API keys** in any repo or deployed file — only placeholders
- **Test before documenting** — verify API calls work before writing SKILL.md
- **Every repo must have SKILL.md** — students clone to `~/.claude/skills/` and it must work
- **Beginner-friendly** — write for someone with no coding experience
- **Hebrew HTML guides** — branded dark theme matching admin aesthetic
- **Cover images** — 16:9, brand style (black bg, red accent, off-white text, Guyaga logo), no day numbers
- **Install prompt** — first line is "easy way" (copy-paste to Claude Code), rest is manual
- **.gitignore** — `.env` files are gitignored in the main website repo

### Cover Image Generation Template

```javascript
// Use gen-dayXX-cover.mjs pattern
// Prompt: "Create a premium skill cover image about '{SKILL_TOPIC}' for an AI course.
// Swiss-design, Black #111111, Signal Red #E63B2E, Off-White #F5F3EE
// CENTER: Large bold '{SKILL_TOPIC}' + '{Service Name}' in red monospace
// 6 geometric line-art icons, Guyaga logo top right
// Bottom: '10 Days 10 Skills' tiny monospace"
```

### HTML Guide Template

Located at `public/course/guides/template.html` — copy and customize for each day.

---

## Workflow for Unlocking a Lesson

1. Go to `/admin/course`
2. Click the lock button on the session → confirm unlock
3. Click "Email" to notify all enrolled members
4. Members receive branded email with "כניסה למרכז הקורס" CTA
5. Members access `/course/hub` with their email → see new lesson expanded

---

## Course Hub Access

- Email gate at `/course/hub` — checks `course_members` table
- localStorage persists login (`course_member_email`, `course_member_name`)
- Hub has no site navbar/footer — standalone dark dashboard
- 3 tabs: Lessons (main) | Resources | About
- Unlocked lessons are expandable with: description, install prompt (easy + manual), resources, examples

---

## File Locations

### Course Components
```
src/pages/CoursePage.jsx              — Public landing page
src/pages/CourseHub.jsx               — Email-gated hub dashboard
src/pages/admin/CourseAdmin.jsx       — Session manager
src/pages/admin/CourseMembersAdmin.jsx — Member management
src/components/course/                 — All course components
src/utils/course.js                   — Supabase queries + email functions
```

### Course Assets
```
public/course/hero.jpg                — Landing page hero image
public/course/cover.jpg               — Combined HE/EN cover
public/course/instructor.jpg          — Guy's photo
public/course/og-image.jpg            — Social share image
public/course/guides/                  — HTML guides per day
public/course/examples/                — Cover images + example results
```

### Skill Repos (local)
```
course-repos/10d10s-day01-image-generation/
course-repos/10d10s-day02-video-analyzer/
course-repos/10d10s-day03-video-editor/
course-repos/10d10s-day04-voice-audio/
course-repos/10d10s-day05-video-generation/
course-repos/10d10s-day06-web-intelligence/
course-repos/10d10s-day07-social-media/
course-repos/10d10s-day08-whatsapp/
```

### Course Skills (installed locally)
```
~/.claude/skills/nano-banano-pro/          — Day 1
~/.claude/skills/ai-video-analyzer/        — Day 2
~/.claude/skills/ai-video-editor/          — Day 3
~/.claude/skills/ai-voice-audio/           — Day 4
~/.claude/skills/fal-ai-video-generation/  — Day 5
~/.claude/skills/web-intelligence/         — Day 6
~/.claude/skills/social-media-publisher/   — Day 7
~/.claude/skills/whatsapp-messenger/       — Day 8
```

---

## Brand Assets

- **Logo:** `My image and logo/logo.png` (white Guyaga script)
- **Photo:** `My image and logo/me.jpg` (Guy's headshot)
- **Colors:** Black #111111, Signal Red #E63B2E, Paper #E8E4DD, Off-White #F5F3EE
- **Fonts:** Space Grotesk (sans), DM Serif Display (serif), Space Mono (mono), Heebo (Hebrew)

---

## Important Notes

- Upload Post pricing: ~$25 for 5 **brands** (each brand connects up to 11 platforms)
- Green API: unofficial WhatsApp API — warn students about ban risks
- fal.ai: video generation costs money per second — always mention pricing
- All email goes through Supabase Edge Function `send-course-email` to avoid CORS
- Resend secrets set on Supabase: `RESEND_API_KEY`, `RESEND_FROM`
- The fal MCP is installed locally: `claude mcp add --transport http fal-ai https://mcp.fal.ai/mcp --header "Authorization: Bearer KEY"`
