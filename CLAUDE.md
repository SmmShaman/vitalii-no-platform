# CLAUDE.md - Project Documentation

## Project Overview

**Vitalii Berbeha Portfolio** - Professional portfolio with blog and news section. Built on Next.js 15 with Supabase backend.

**Production URL:** https://vitalii.no
**Admin Panel:** /admin/login → /admin/dashboard

---

## Quick Start

```bash
# Development
npm install
npm run dev              # http://localhost:3000

# Production
npm run build
npm start

# Quality checks
npx tsc --noEmit        # TypeScript validation
npm run lint            # ESLint
```

---

## Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| **Frontend** | Next.js | 15.1.0 |
| **UI** | React | 19.1.0 |
| **Language** | TypeScript | 5.9.3 |
| **Styling** | Tailwind CSS | 3.4.18 |
| **Animations** | GSAP, Framer Motion, Three.js | - |
| **Backend** | Supabase (PostgreSQL) | 2.76.1 |
| **Storage (primary)** | Cloudflare R2 (`news-images`, `daily-videos`) | - |
| **Storage (legacy)** | Supabase Storage (kept as fallback) | - |
| **Edge Functions** | Deno | - |
| **AI (text)** | Google Gemini 2.5 Flash → Claude → Groq → NVIDIA NIM (cascade) | - |
| **AI (images)** | Google Gemini 3 Pro Image Preview ("Nano Banana Pro") | paid model |
| **Deployment** | Netlify | - |
| **CI/CD** | GitHub Actions | - |
| **Languages** | Multilingual support | EN, NO, UA |

---

## Project Structure

```
├── app/                          # Next.js App Router
│   ├── @modal/                   # Parallel routes (intercepted modals)
│   ├── admin/                    # Admin dashboard (9 tabs)
│   ├── blog/[slug]/              # Dynamic blog pages
│   ├── news/[slug]/              # Dynamic news pages
│   ├── page.tsx                  # Home (BentoGrid)
│   ├── layout.tsx                # Root layout
│   └── sitemap.ts, robots.ts     # SEO
│
├── components/
│   ├── layout/                   # Header, Footer, Sidebar
│   ├── sections/                 # BentoGrid, NewsSection, BlogSection
│   ├── ui/                       # Reusable UI components
│   ├── admin/                    # 17 admin panel components
│   │   └── news-monitor/         # RSS monitoring system (8 files)
│   └── background/               # ParticleBackground
│
├── supabase/
│   ├── functions/                # 29 Edge Functions (Deno)
│   │   ├── _shared/              # Shared helpers
│   │   ├── telegram-scraper/     # Telegram channel scraping (MTKruto)
│   │   ├── fetch-news/           # RSS feed fetching
│   │   ├── analyze-rss-article/  # AI relevance scoring
│   │   ├── process-rss-news/     # RSS → News processing
│   │   └── ...                   # 24 more functions
│   └── migrations/               # SQL migrations
│
├── .github/workflows/            # CI/CD (11 workflows)
│   ├── deploy.yml                # Netlify deployment
│   ├── deploy-supabase.yml       # Edge Functions + migrations
│   ├── realtime-scraper.yml      # Telegram scraping (every 10 min)
│   ├── rss-monitor.yml           # RSS monitoring (scheduled)
│   └── ...                       # 7 more workflows
│
├── .agent/                       # Claude Code skills
│   └── skills/ui-ux-pro-max/     # UI/UX design intelligence toolkit
│
├── .brv/                         # ByteRover context tree
│   ├── context-tree/             # Curated project knowledge (80+ files)
│   └── sessions/                 # Query history
│
└── scripts/                      # GitHub Actions scripts
    ├── video-processor/          # Telegram → Remotion → YouTube
    │   ├── index.js              # Main processor
    │   ├── generate-script.js    # AI script generation (Azure OpenAI)
    │   └── generate-voiceover.js # TTS voiceover + timestamps (OpenAI)
    ├── remotion-video/           # Remotion project (video templates)
    │   └── src/
    │       ├── compositions/     # NewsVideo (vertical + horizontal)
    │       └── components/       # AnimatedSubtitles
    └── linkedin-video/           # LinkedIn native video
```

---

## Storage & Image Pipeline

### Where image URLs in the DB point

| URL pattern | Source | Legal status |
|-------------|--------|--------------|
| `pub-612755c33acf4a878ca21c80dcd5cbe8.r2.dev/...` | Cloudflare R2 (our copy) | ⚠️ stored copy — `news.image_url` ≈1.9k entries (telegram/), `processed_image_url` ≈55 entries (AI-generated) |
| `akamai.vgc.no/v2/images/...`, `image-www.kode24.no/...`, `images.gfx.no/...`, `static.itavisen.no/...` | External publisher CDNs | ✅ hotlink — no copy stored, defended by Svensson/BestWater/VG Bild-Kunst (CJEU) |
| `uchmop....supabase.co/storage/v1/object/public/...` | Supabase Storage | should be **0** in DB — fully migrated to R2 on 2026-05-10. If you see this in new code, the writer needs migration. |

### R2 layout (`news-images` bucket)

```
news-images/
├── telegram/<channel>/<id>.jpg   # 1940 — scraped from AI/tech Telegram channels (no Norwegian news sources)
├── blog-covers/voice-*.png       # 25 — AI-generated blog covers
├── custom/<uuid>_<ts>.jpg        # 25 — user uploads + custom edits
├── processed/<ts>_<id>.jpg       # AI-generated by process-image (Gemini 3 Pro Image)
└── (root files)                  # legacy 9 files
```

R2 public base: `https://pub-612755c33acf4a878ca21c80dcd5cbe8.r2.dev/`
CF account: `1438e8d03009209c4a82ea4c28bdb358` · bucket: `news-images` · location: EEUR

### How to upload a new image (the right way)

`process-image` Edge Function is the canonical example — it generates an image with Gemini and uploads to R2 via Cloudflare API:
```ts
PUT https://api.cloudflare.com/client/v4/accounts/{CF_ACCOUNT_ID}/r2/buckets/news-images/objects/{key}
Authorization: Bearer {CF_API_TOKEN}
Content-Type: image/jpeg
Body: <bytes>
```

Then write the public URL into the DB column:
```ts
const r2Url = `https://pub-612755c33acf4a878ca21c80dcd5cbe8.r2.dev/${key}`
```

DO NOT use `supabase.storage.from('news-images').upload()` — that writes to Supabase Storage and burns the 1 GB free quota.

---

## Core Architecture

### Database Schema

**Main Tables:**

#### `news` - News articles
- Multilingual fields: `title_en/no/ua`, `content_en/no/ua`, `slug_en/no/ua`
- Media: `image_url`, `processed_image_url`, `video_url`, `video_type`
- Moderation: `pre_moderation_status` (pending/approved/rejected)
- Social: `linkedin_post_id`, `instagram_post_id`, `facebook_post_id`
- AI: `image_generation_prompt`, `is_rewritten`

#### `blog_posts` - Blog articles
- Similar structure to news
- Additional: `author_id`, `category`, `reading_time`, `is_featured`
- `source_news_id` (FK → news, if converted from news)

#### `news_sources` - Content sources
- Fields: `name`, `url`, `rss_url`, `source_type` (rss/telegram/web)
- Scraping: `fetch_interval`, `last_fetched_at`, `is_active`

#### `ai_prompts` - AI prompt templates
- Types: `pre_moderation`, `news_rewrite`, `blog_rewrite`, `image_generation`, `image_template_*`, `social_teaser_*`
- Editable via admin panel
- Used by: pre-moderate-news, process-news, generate-image-prompt, generate-social-teasers

#### `social_media_posts` - Social media tracking
- Fields: `platform`, `post_id`, `post_url`, `language`, `status`
- Duplicate prevention: checks for existing posted/pending entries

#### `users` - Admin users
- Authentication for admin panel
- Fields: `email`, `password_hash`, `role`, `is_active`

### Supabase Edge Functions

29 Deno-based serverless functions:

**Content Scraping & Processing:**
| Function | Purpose | Trigger |
|----------|---------|---------|
| `telegram-scraper` | Telegram channel scraping (MTKruto) | Scheduled (every 10 min) |
| `fetch-news` | RSS feed fetching | Admin/Scheduled |
| `fetch-rss-preview` | RSS preview for monitoring | Admin panel |
| `analyze-rss-article` | AI relevance scoring (1-10) | After RSS fetch |
| `process-rss-news` | RSS → News with AI rewrite | Admin/Telegram bot |
| `pre-moderate-news` | AI spam/ad filtering | After scraper |
| `process-news` | AI translation to EN/NO/UA | Telegram bot |
| `process-blog-post` | News → Blog conversion | Telegram bot |

**Social Media:**
| Function | Purpose | Trigger |
|----------|---------|---------|
| `post-to-linkedin` | LinkedIn publishing (native upload) | Telegram bot |
| `post-to-instagram` | Instagram publishing | Telegram bot |
| `post-to-facebook` | Facebook publishing | Telegram bot |
| `generate-social-teasers` | Platform-specific AI content | Social publishing |

**AI & Content:**
| Function | Purpose | Trigger |
|----------|---------|---------|
| `generate-image-prompt` | AI image description generation | After moderation |
| `process-image` | Gemini AI image processing | Manual/Telegram |
| `generate-tiktok-content` | TikTok content generation | Manual |

**Telegram Bot:**
| Function | Purpose | Trigger |
|----------|---------|---------|
| `telegram-webhook` | Bot callback handling | Telegram |
| `telegram-monitor` | Bot health checks | Scheduled |
| `resend-to-bot` | Retry failed posts | Scheduled |
| `resend-stuck-posts` | Resend stuck posts | Manual |

**Comments & Communities:**
| Function | Purpose | Trigger |
|----------|---------|---------|
| `comments-bot-webhook` | Comments bot webhook | Telegram |
| `sync-comments` | Sync social media comments | Scheduled |
| `generate-comment-reply` | AI comment reply generation | Manual |
| `post-comment-reply` | Post comment reply | Manual |
| `monitor-communities` | Monitor community posts | Scheduled |

**Utilities:**
| Function | Purpose | Trigger |
|----------|---------|---------|
| `send-contact-email` | Contact form emails (Resend API) | Contact form |
| `manage-sources` | Source management | Manual |
| `find-source-link` | Find source links | Manual |
| `reprocess-videos` | Batch video reprocessing | Manual |
| `test-youtube-auth` | YouTube OAuth testing | Manual |

**Shared Helpers** (`_shared/`):
- `youtube-helpers.ts` - YouTube OAuth & upload
- `github-actions.ts` - Trigger workflows
- `facebook-helpers.ts` - Instagram/Facebook API
- `social-media-helpers.ts` - Duplicate prevention

**Deploy:**
```bash
cd supabase
supabase functions deploy <function-name> --no-verify-jwt
```

### Component Architecture

**Desktop Layout:**
- `BentoGrid` - 6-section grid with hover effects (About, Services, Projects, Skills, News, Blog)
- Hover interactions: background color change, hero text fill animation
- Section-specific animations: ProjectsCarousel (explosion grid), SkillsAnimation (particle effect)

**Mobile Layout:**
- `BentoGridMobile` - Bottom navigation app-style
- Swipe gestures for carousels
- Compact animations (typewriter, rotation, horizontal scroll)

**Modal System:**
- Next.js parallel routes (`@modal`)
- Intercepts `/blog/[slug]` and `/news/[slug]` routes
- Shows modal overlay on homepage, full page on direct navigation

**Admin Panel** (9 tabs with collapsible sidebar):

| Tab | Component | Description |
|-----|-----------|-------------|
| Overview | `DashboardOverview` | Telegram channels + RSS sources monitoring |
| Queue | `NewsQueueManager` | Pending news moderation queue |
| News | `NewsManager` | News CRUD operations |
| Blog | `BlogManager` | Blog posts management |
| Monitor | `NewsMonitorManager` | Real-time RSS feed monitoring (4 tiers) |
| Social | `SocialMediaPostsManager` | Social media posts tracking |
| Comments | `SocialMediaCommentsManager` | Social media comments management |
| Skills | `SkillsManager` | Tech skills CRUD (drag & drop) |
| Settings | 8 sub-tabs | Sources, AI Prompts, Images, API Keys, Accounts, Schedule, Automation, Debug |

**Header:** Inline stats showing `📰 Total/Published | 📖 Total/Published`

---

## Key Features

### Content Management

**Multilingual Content (EN/NO/UA):**
- TranslationContext manages language state
- 3000+ translation strings in `utils/translations.ts`
- Database: separate fields per language (`title_en`, `title_no`, `title_ua`)

**Content Workflow:**
1. Telegram scraper collects content from RSS/Telegram channels
2. AI pre-moderation filters spam (Azure OpenAI)
3. AI generates image description prompt
4. Moderator reviews in Telegram bot
5. Publish to News or Blog
6. Post to social media (LinkedIn/Instagram/Facebook)

**Video Handling:**
- Types: `youtube` (embedded), `telegram_embed` (fallback), `direct_url`
- MTKruto bypasses Telegram Bot API 20MB limit (supports up to 2GB)
- GitHub Actions workflows for heavy processing
- YouTube upload for site embeds (unlisted videos)
- **Remotion Enhancement Pipeline (March 2025):**
  - AI script generation from article text (Azure OpenAI)
  - TTS voiceover with word-level timestamps (OpenAI TTS)
  - Remotion renders final video: blurred background, voiceover, animated subtitles
  - Two templates: Vertical (1080×1920, 9:16) and Horizontal (1920×1080, 16:9)
  - Graceful fallback to raw video if any step fails
  - Toggle: `SKIP_REMOTION=true` to bypass

### Social Media Integration

**LinkedIn:**
- OAuth 2.0 UGC Post API
- Native image upload via Assets API
- Three languages support
- Duplicate prevention via `social_media_posts` table

**Instagram:**
- Facebook Graph API (Business accounts only)
- Required scopes: `instagram_basic`, `instagram_content_publish`
- IMAGE posts (native upload) or ARTICLE posts
- Video/Reels via GitHub Actions (scripts/instagram-video/)

**Facebook:**
- Similar to Instagram (shares codebase)
- Facebook Page API

**AI Social Teasers:**
- Platform-specific content generation
- Optimized for each platform's style and character limits
- Cached in database (`social_teaser_linkedin_en`, etc.)

### AI Systems

**Image Prompt Generation:**
- Two-stage system: Classifier (extracts JSON) → Template (fills placeholders)
- Categories: tech_product, marketing_campaign, ai_research, business_news, science, lifestyle
- Based on awesome-nanobanana-pro methodology
- Editable templates in admin panel

**Content Moderation:**
- Azure OpenAI pre-moderation for spam detection
- Custom prompts via `ai_prompts` table
- Status: pending → approved/rejected

**Content Rewriting:**
- AI translation to multiple languages
- Style adaptation for blog posts
- Maintains source attribution

### SEO Optimization

**Implemented:**
- JSON-LD schemas (BlogPosting, NewsArticle, BreadcrumbList)
- Open Graph metadata (full support)
- Twitter Cards
- Multilingual sitemap with alternates
- Hreflang tags
- Canonical URLs
- Semantic HTML markup
- Image optimization (next/image)

**Files:**
- `utils/seo.ts` - SEO utility functions
- `app/sitemap.ts` - Dynamic sitemap
- `app/robots.ts` - Robots.txt configuration

### Analytics

**Google Tag Manager (GTM-5XBL8L8S):**
- Centralized tracking hub
- Events: page_view, article_view, form_submit, share, language_change, section_click
- Integrations: GA4, Meta Pixel, LinkedIn Insight Tag
- Context: `TrackingContext` with auto page view tracking

---

## CI/CD Pipelines

**GitHub Actions Workflows (11 total):**

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `deploy.yml` | Push to main | Netlify deployment |
| `deploy-supabase.yml` | Changes in `supabase/**` | Edge Functions + migrations |
| `realtime-scraper.yml` | Every 10 min | Telegram channel scraping |
| `rss-monitor.yml` | Scheduled | RSS feed monitoring |
| `process-video.yml` | Every 30 min | Batch video upload to YouTube |
| `linkedin-video.yml` | Repository dispatch | LinkedIn native video upload |
| `instagram-video.yml` | Repository dispatch | Instagram Reels upload |
| `facebook-video.yml` | Repository dispatch | Facebook video upload |
| `reprocess-videos.yml` | Manual | Batch video cleanup |
| `monitor-communities.yml` | Scheduled | Community posts monitoring |
| `sync-social-comments.yml` | Scheduled | Sync social media comments |

**Netlify Configuration:**
- Auto-builds DISABLED (`stop_builds: true`)
- Deployment only via GitHub Actions
- Prevents env var issues

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_SITE_URL=https://vitalii.no

# Telegram (Bot API + MTProto)
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
TELEGRAM_API_ID=...
TELEGRAM_API_HASH=...

# YouTube API
YOUTUBE_CLIENT_ID=...
YOUTUBE_CLIENT_SECRET=...
YOUTUBE_REFRESH_TOKEN=...

# LinkedIn
LINKEDIN_ACCESS_TOKEN=...
LINKEDIN_PERSON_URN=urn:li:person:...

# Instagram/Facebook
FACEBOOK_PAGE_ACCESS_TOKEN=...
INSTAGRAM_ACCOUNT_ID=...
FACEBOOK_PAGE_ID=...

# Azure OpenAI
AZURE_OPENAI_ENDPOINT=https://...
AZURE_OPENAI_API_KEY=...

# Google AI (Gemini) — project 797203710515 (Generative Language API enabled)
GOOGLE_API_KEY=AIzaSy...

# Cloudflare R2 (primary image storage)
CF_API_TOKEN=cfut_...     # Object Read/Write to news-images + daily-videos
CF_ACCOUNT_ID=1438e8d03009209c4a82ea4c28bdb358

# Analytics
NEXT_PUBLIC_GTM_ID=GTM-5XBL8L8S

# Email (Contact form)
RESEND_API_KEY=re_...
ADMIN_EMAIL=berbeha@vitalii.no

# GitHub Actions
GH_PAT=ghp_... (for triggering workflows)

# OpenAI (TTS voiceover for Remotion)
OPENAI_API_KEY=sk-...
```

---

## Development Commands

```bash
# Development
npm run dev                    # Start dev server
npm run build                  # Production build
npm start                      # Start production server

# Quality checks
node node_modules/typescript/bin/tsc --noEmit   # TypeScript check
npm run lint                                      # ESLint

# Supabase
cd supabase
supabase functions deploy <name> --no-verify-jwt
supabase secrets set KEY="value"

# ByteRover (context management)
brv query "How is authentication implemented?"
brv curate "Context to store" -f path/to/file.ts   # CONTEXT before -f flag!
brv status
```

---

## Deployment

**Production:**
1. Push to `main` branch
2. GitHub Actions runs `deploy.yml`
3. Netlify builds and deploys
4. If Edge Functions changed, `deploy-supabase.yml` runs

**Manual Deployment:**
```bash
# Netlify
netlify deploy --prod

# Supabase Edge Functions
cd supabase
for dir in functions/*/; do
  if [ -d "$dir" ] && [ "$(basename $dir)" != "_shared" ]; then
    supabase functions deploy $(basename $dir) --no-verify-jwt
  fi
done
```

---

## Common Tasks

### Add New Edge Function
```bash
cd supabase/functions
mkdir my-function
cd my-function
# Create index.ts
supabase functions deploy my-function --no-verify-jwt
```

### Update AI Prompts
1. Go to Admin Panel → Settings → AI Prompts
2. Edit prompt text
3. Save changes
4. Next generation uses updated prompt

### Add New Social Media Platform
1. Create Edge Function: `post-to-{platform}`
2. Add helpers to `_shared/{platform}-helpers.ts`
3. Update `telegram-webhook` with callback handlers
4. Add fields to `news`/`blog_posts` tables
5. Update `social_media_posts` table support

### Debug Edge Functions
```bash
# View logs
supabase functions logs <function-name>

# Test locally
supabase functions serve <function-name>
```

---

## Important Notes

### Video Processing
- MTKruto (MTProto) bypasses Telegram Bot API 20MB limit
- GitHub Actions used for heavy video processing (LinkedIn, Instagram, YouTube)
- Remotion renders enhanced videos with AI voiceover + animated subtitles
- Fallback to raw video upload if Remotion/AI steps fail
- Fallback to Telegram embed if YouTube upload fails

### Social Media Posting
- Duplicate prevention via `social_media_posts` table (status: pending/posted/failed)
- Native image/video uploads for better quality
- Platform-specific AI-generated teasers

### AI Prompts
- All prompts editable via admin panel
- Stored in `ai_prompts` table
- Latest `updated_at` prompt used (handles multiple active prompts)

### Mobile Layout
- Different component (`BentoGridMobile`) vs desktop (`BentoGrid`)
- Bottom navigation app-style
- Touch/swipe gestures implemented
- Safe area insets for notched devices

### Supabase Integration
- Graceful degradation if credentials missing
- RLS policies for security
- Service role key for Edge Functions

### Free-tier quota model (Supabase)
Two distinct quota types — they behave differently and the difference matters:
- **Egress / Cached egress** (consumption-based) — resets monthly with billing cycle. Once restricted mid-cycle, neither reducing usage nor deleting files lifts it; only the cycle reset or Pro upgrade does.
- **Storage size** (size-based) — 1 GB on Free, NEVER auto-resets. Must reduce *actual* usage below 1 GB *before* the ~30-day grace period ends. After restriction kicks in, only Pro upgrade or successful support ticket lifts it. The May 2026 incident was triggered by 626 MB of phantom records (storage.objects metadata pointing to objects that were never actually written to S3 backend) — these counted toward quota but couldn't be migrated. Cleaned via Storage API DELETE, not direct SQL (`storage.protect_delete()` trigger blocks the latter).

---

## Known Issues / Tech Debt

### Edge Functions still writing to Supabase Storage (should write to R2)

These three were not updated in the 2026-05-10 R2 migration and continue to grow Supabase Storage:
- `telegram-scraper` — scrapes Telegram channels into `news-images/telegram/<channel>/<id>.jpg`
- `process-voice-blog` — uploads blog covers to `news-images/blog-covers/`
- `daily-video-bot` — uploads thumbnails to `daily-videos/thumbnails/`

`process-image` is the reference implementation: see `supabase/functions/process-image/index.ts:1373-1401` (`uploadProcessedImage`). Replicate that pattern in the three above.

Until fixed: a daily/weekly migration job is needed to move new files from Supabase Storage to R2 and rewrite URLs in `news.image_url` / `blog_posts.*` / `daily_*`. Otherwise Supabase Storage will eventually re-cross 1 GB and trigger the quota wall again.

### Schema landmine: `news.is_published DEFAULT true`

Original schema had `is_published BOOLEAN DEFAULT true` — a footgun: any INSERT that forgets to set it explicitly auto-publishes the row before content is rewritten/translated. All current INSERT paths set `false` explicitly so it was invisible. Migration `20260510150000_news_is_published_default.sql` flips the default to `false`. Plus: `auto-reject-news.yml` now filters by `is_published = false` (was missing the filter, paired with the `true` default to produce the May 5–8 "zombie row" incident — 372 rows ending up `is_published=true + pre_moderation_status='rejected'` and surfacing at the top of the public feed via `published_at IS NULL`).

Public-feed queries in `integrations/supabase/client.ts` now also include `.not('published_at', 'is', null)` as belt-and-braces.

### LinkedIn / Facebook / Instagram tokens

- `LINKEDIN_ACCESS_TOKEN` in `api_settings`: refreshed 2026-05-10, expires ~2026-07-09 (60-day). Generated via 3-legged OAuth — when it expires, regenerate at https://www.linkedin.com/developers/apps. PERSON_URN is `urn:li:person:8makpq4Bn_`.
- `FACEBOOK_PAGE_ACCESS_TOKEN` lives in **two places**: Supabase Edge Function Secret (live, valid) and GitHub Actions Secret (likely stale — bypass scripts in `scripts/bypass/auto-publish.mjs` use this one). When Meta posts fail silently, the GitHub Secret is the suspect.
- `scripts/bypass/auto-publish.mjs` was updated to propagate Meta API errors to `social_media_posts.error_message` (was swallowing them — see lines ~195-206 and ~335-340).

### Copyright Agent A/S (NTB) legal context

Three claims received March 2026 about images on `vitalii.no` (~12,645 NOK total). Defense: those specific 3 images are **hotlinks** from external publisher CDNs (akamai.vgc.no, image-www.kode24.no), not copies, so CJEU rulings (Svensson C-466/12, BestWater C-348/13, VG Bild-Kunst C-392/19) and Copyright Agent's own published position ("Hotlinking images without consent is still legal in Europe") apply. Defense letter draft sits in conversation history; not yet sent. The 1940 R2 `telegram/` images are from AI/tech channels (no Norwegian news sources) so NTB exposure there is low. **Don't add Norwegian news scraping that copies images** — that would create direct NTB exposure that the hotlink defense can't reach.

---

## Troubleshooting

### Edge Function Not Updating
- Check GitHub Actions logs for deployment status
- Verify function checksum changed (add version log)
- Manual deploy if needed

### Social Media Errors
**LinkedIn:**
- Token expires after 60 days → regenerate
- Check person URN format: `urn:li:person:xxxxx`

**Instagram:**
- Error #10: Missing `instagram_content_publish` scope
- Error #190: Token expired
- Must be Business account linked to Facebook Page

### Video Processing Fails
- Check MTKruto credentials (TELEGRAM_API_ID, TELEGRAM_API_HASH)
- Verify YouTube OAuth refresh token
- Check GitHub Actions secrets

### Telegram Bot Not Working
- Verify webhook URL in BotFather
- Check Edge Function logs
- Test with manual trigger

---

## Claude Code Integration

### 🤖 Agent Skills (`.agent/`)

The project includes Claude Code skills for enhanced AI assistance:

**ui-ux-pro-max** - UI/UX Design Intelligence Toolkit
- Location: `.agent/skills/ui-ux-pro-max/`
- Searchable databases: UI styles, color palettes, font pairings, charts, UX guidelines
- Stack support: React, Next.js, Vue, Svelte, Tailwind, shadcn/ui, etc.
- Trigger: `/ui-ux-pro-max` or automatic for UI tasks

```bash
# Search UI patterns
python3 .agent/skills/ui-ux-pro-max/src/ui-ux-pro-max/scripts/search.py "glassmorphism" --domain style

# Stack-specific search
python3 .agent/skills/ui-ux-pro-max/src/ui-ux-pro-max/scripts/search.py "button" --stack nextjs
```

### 📚 ByteRover Context Tree (`.brv/`)

Active memory system for project knowledge:

**Structure:**
```
.brv/
├── context-tree/           # Curated knowledge (80+ files)
│   ├── architecture/       # UI components, database, edge functions, CI/CD
│   ├── features/          # AI systems, social media, telegram workflow
│   ├── bug_fixes/         # Bug fix history with solutions
│   ├── design/            # UI standards, z-index system
│   └── agent_skills/      # Agent skills documentation
├── sessions/              # Query history
└── config.json            # Project configuration
```

**Commands:**
```bash
# Query project knowledge
brv query "How does RSS monitoring work?"
brv query "What is the admin dashboard structure?"

# Curate new knowledge (CONTEXT before --files)
brv curate "Description of what you learned" -f path/to/file.ts
brv curate "Multi-file insight" -f file1.ts -f file2.ts
```

---

## Additional Documentation

### 📁 Static Documentation (`docs/byterover-context/`)

Full project history exported for reference (44 files, ~130k chars):

- **`integrations/`** - LinkedIn, Instagram, Video processing, AI teasers
- **`features/`** - AI systems, SEO, Mobile layout, Analytics
- **`bugfixes/`** - Complete bug fix history with dates
- **`architecture/`** - Database, Edge Functions, Components, CI/CD
- **`implementation/`** - Detailed implementation guides

```bash
# Curate all static docs to ByteRover
cd docs/byterover-context && ./curate-all.sh
```

---

### External Resources

- [Next.js 15 Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [LinkedIn UGC API](https://learn.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/ugc-post-api)
- [Instagram Graph API](https://developers.facebook.com/docs/instagram-api)
- [MTKruto (Telegram MTProto)](https://github.com/MTKruto/MTKruto)
- [ByteRover Docs](https://docs.byterover.dev)

---

**Last Updated:** March 7, 2025
**Maintained By:** Vitalii Berbeha (@SmmShaman)
