# Blog AI Generator — Design Document

## Intent & Why

Add a Blog section to the portfolio that publishes AI-generated articles about React and React Native. Content is generated on demand via GitHub Actions (manual trigger), reviewed via a GitHub PR + Vercel preview, then merged to publish. No external CMS or database — all content lives in the repo as MDX files.

## Goals

- Manual-trigger GitHub Actions workflow generates one blog post (MDX + image) per run
- Duplicate topic prevention: workflow reads existing posts before generating
- PR-based approval: generated content lands as a PR; merge = publish
- Blog listing at `/blog`: card grid with cover image
- Blog detail at `/blog/[slug]`: Medium-style reading experience
- Blog section added to the homepage single-page navigation

## Non-Goals

- Automated cron scheduling (user will add later if needed)
- Comments, likes, or any social feature
- Multi-language support
- Search or filtering on the blog list

## Anti-Goals

- External CMS (Contentful, Sanity, etc.) — repo is source of truth
- Database for posts — MDX files only
- Auto-publish without human approval

## Constraints

- Next.js 16.3.5, React 19, TypeScript — no framework upgrade
- Free tier only: Gemini 3.6 Flash (text), Gemini image model (image)
- Vercel deployment — no server, static generation where possible
- No new paid services

## Architecture

### Content Storage

```
content/
  blog/
    YYYY-MM-DD-slug.mdx     ← blog post content
public/
  blog/
    images/
      YYYY-MM-DD-slug.png   ← cover image (same slug as MDX)
```

### MDX Frontmatter Schema

```yaml
---
title: "Post Title"
date: "YYYY-MM-DD"
description: "One-sentence summary for card preview"
tags: ["react", "architecture"]
image: "/blog/images/YYYY-MM-DD-slug.png"
---
```

### Dependencies to Add

- `gray-matter` — parse MDX frontmatter at build time
- `next-mdx-remote` — render MDX content in blog detail page
- `@tailwindcss/typography` (if Tailwind is present) or inline prose styles — Medium-style reading

> Builder note: check if Tailwind is already in the project; if not, use plain CSS for prose styles.

### Routes

| Route | Rendering | Description |
|---|---|---|
| `/blog` | SSG | Card grid listing all published posts |
| `/blog/[slug]` | SSG | Single post reader |

Both pages use `generateStaticParams` to enumerate MDX files at build time.

### Homepage Integration

Add a `Blog` section component to `app/page.tsx` between existing sections (after Projects, before Certifications is a reasonable default — builder may adjust). Add nav link `Blog` to `Nav.tsx`.

## GitHub Actions Workflow

File: `.github/workflows/generate-blog.yml`

Trigger: `workflow_dispatch` only (manual).

### Steps

1. **Read existing posts** — list all `content/blog/*.mdx`, extract `title` and `tags` from frontmatter → build exclusion list
2. **Generate topic** — call Gemini 3.6 Flash with exclusion list, ask for a unique topic from the pool
3. **Generate content** — call Gemini 3.6 Flash with the chosen topic, output full MDX body (500–1000 words, English)
4. **Generate image** — call Gemini image model with a prompt derived from the topic → save as PNG
5. **Write files** — write MDX to `content/blog/`, image to `public/blog/images/`
6. **Open PR** — create branch `blog/YYYY-MM-DD-slug`, commit both files, open PR titled `Blog: <post title>`

### Topic Pool

Gemini picks one topic per run from these categories (excluding already-covered):
- React Native fundamentals
- React fundamentals
- React Native latest updates
- React latest updates
- React Native architecture comparisons (e.g. Expo vs bare, new arch vs old arch)
- React architecture patterns (e.g. feature-sliced, atomic, monorepo)
- React Native vs React for shared logic
- React Native vs Flutter, Ionic, etc.
- React vs Vue, Svelte, Angular, etc.
- React Native performance deep-dives
- React hooks patterns

### Secrets Required (GitHub repo settings)

| Secret | Usage |
|---|---|
| `GEMINI_API_KEY` | Text + image generation |
| `GH_PAT` | Open PR via GitHub API (needs `repo` scope) |

## UI Design

### `/blog` — Card Grid

- Responsive grid: 3 columns desktop, 2 tablet, 1 mobile
- Each card: cover image (16:9), title, date, description, tags
- Card hover: subtle lift/shadow
- Style consistent with existing portfolio design language

### `/blog/[slug]` — Reader

- Max-width prose container (~680px), centered
- Cover image full-width at top
- Title, date, tags below image
- Body: Medium-style typography (large line-height, comfortable font size)
- Back link to `/blog`

### Homepage Blog Section

- Section heading consistent with other sections (e.g. `Experience`, `Projects`)
- Show latest 3 posts as cards
- "View all" link to `/blog`

## Builder Calls (My Decisions)

- Post order on `/blog`: newest first (sorted by date in filename)
- Image format: PNG 1200×630px
- Slug generation: kebab-case of title, stripped of special chars, max 60 chars
- No pagination on `/blog` for now (portfolio scale)
- GitHub Actions uses Node.js script (not shell) using `@octokit/rest` for PR creation
- MDX rendered with `next-mdx-remote/rsc` (App Router RSC export)
- Prose styles in `app/blog/[slug]/prose.module.css`, inheriting CSS variables from `globals.css`
- `generateMetadata()` in `/blog/[slug]` for OG metadata (title, description, image)
- `app/sitemap.ts` extended to include all blog posts

## Resolved Design Questions

**Nav:** Homepage has `#blog` section (scroll-based preview like other sections) + standalone `/blog` route. Nav link scrolls to `#blog`; section has "View all" → `/blog`.

**Section position:** Hero → About → Skills → Experience → Projects → Certs → Games → **Blog** → Contact

**Gemini model IDs:**
- Text: `gemini-3.6-flash`
- Image: `gemini-3.1-flash-image`
