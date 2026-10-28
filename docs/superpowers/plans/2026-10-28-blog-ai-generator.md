# Blog AI Generator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an AI-generated Blog section to the portfolio with a GitHub Actions workflow that generates MDX posts via Gemini, opens a PR for review, and publishes on merge.

**Architecture:** Blog posts are MDX files in `content/blog/` with images in `public/blog/images/`. Next.js reads them at build time via `lib/blog.ts`. The homepage shows a 3-card preview section; `/blog` shows the full grid; `/blog/[slug]` renders the reader. A GitHub Actions `workflow_dispatch` script generates content + image via Gemini, commits to a branch, and opens a PR.

**Tech Stack:** Next.js 16.3.5, React 19, TypeScript, `gray-matter`, `next-mdx-remote/rsc`, `@google/genai`, `@octokit/rest`, CSS Modules

**Spec:** `docs/superpowers/specs/2026-10-28-blog-ai-generator-design.md`

## Global Constraints

- Next.js 16.3.5 — no upgrade
- React 19, TypeScript — no changes to compiler settings
- Vercel deployment — all blog routes must SSG via `generateStaticParams`
- No Tailwind — use CSS Modules only, inherit CSS variables from `globals.css`
- Free Gemini tier — text model `gemini-3.6-flash`, image model `gemini-3.1-flash-image`
- GitHub Actions trigger: `workflow_dispatch` only (manual)
- MDX frontmatter fields: `title`, `date`, `description`, `tags`, `image` — all required
- Image format: PNG, 1200×630px stored at `public/blog/images/YYYY-MM-DD-slug.png`
- Post slug: kebab-case, max 60 chars, derived from title

## Review Focus

- `getPostBySlug` called with a slug that has no matching file — must return `null`, not throw
- `getAllPosts` called when `content/blog/` is empty — must return `[]`, not throw
- MDX file with missing frontmatter fields — `gray-matter` returns `undefined`; callers must handle gracefully
- Gemini returns a topic already in the exclusion list — generate-blog script must validate uniqueness before writing
- GitHub Actions run when `content/blog/` directory does not yet exist (first run) — script must create it

---

## Task 1: Install deps + blog data utilities

**Files:**
- Modify: `package.json`
- Create: `lib/blog.ts`
- Create: `content/blog/2026-10-28-welcome-to-my-blog.mdx` (fixture for testing)
- Create: `public/blog/images/` (directory marker)

**Interfaces:**
- Produces:
  ```ts
  export type BlogPost = {
    slug: string
    title: string
    date: string
    description: string
    tags: string[]
    image: string
  }
  export type BlogPostWithContent = BlogPost & { content: string }
  export function getAllPosts(): BlogPost[]
  export function getPostBySlug(slug: string): BlogPostWithContent | null
  ```

- [ ] **Step 1: Install dependencies**

```bash
npm install gray-matter next-mdx-remote
```

- [ ] **Step 2: Create fixture MDX file at `content/blog/2026-10-28-welcome-to-my-blog.mdx`**

```mdx
---
title: "Welcome to My Blog"
date: "2026-10-28"
description: "An introduction to my React and React Native writing."
tags: ["react", "react-native"]
image: "/blog/images/2026-10-28-welcome-to-my-blog.png"
---

This is a placeholder post used for development. Real posts are AI-generated.
```

- [ ] **Step 3: Create a 1200×630 placeholder PNG at `public/blog/images/2026-10-28-welcome-to-my-blog.png`**

Any solid-color 1200×630 PNG works — the fixture only needs to exist so `<Image>` does not 404 during dev.

- [ ] **Step 4: Implement `lib/blog.ts`**

- `getAllPosts()`: read all `*.mdx` files from `content/blog/` using `fs.readdirSync`, parse frontmatter with `gray-matter`, return `BlogPost[]` sorted newest-first by `date`. Return `[]` if directory is empty or missing.
- `getPostBySlug(slug)`: read `content/blog/${slug}.mdx`, parse with `gray-matter`, return `BlogPostWithContent` with `content` = raw MDX string. Return `null` if file does not exist.

- [ ] **Step 5: Verify build compiles**

```bash
npx tsc --noEmit
```
Expected: no errors in `lib/blog.ts`

- [ ] **Step 6: Commit**

```bash
git add lib/blog.ts content/blog/ public/blog/ package.json package-lock.json
git commit -m "feat: add blog data utilities and dependencies"
```

---

## Task 2: `/blog` listing page

**Files:**
- Create: `app/blog/page.tsx`
- Create: `app/blog/page.module.css`

**Interfaces:**
- Consumes: `getAllPosts(): BlogPost[]` from `lib/blog.ts`

- [ ] **Step 1: Create `app/blog/page.module.css`**

Styles for:
- `.page` — outer container, `padding: 80px 60px`, `max-width: 1200px`, `margin: 0 auto`
- `.heading` — page title, same style as `h2` in `globals.css`
- `.grid` — `display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px`
- `.card` — white background, `border-radius: var(--r)`, `border: 1px solid var(--border)`, hover lift (`translateY(-5px)`, `box-shadow`)
- `.cardImage` — 16:9 ratio container at top of card
- `.cardBody` — `padding: 20px 24px`
- `.cardTitle` — bold, `font-size: 18px`
- `.cardDesc` — `color: var(--text-2)`, `font-size: 14px`, `margin-top: 8px`
- `.cardMeta` — flex row, `color: var(--text-3)`, `font-size: 12px`, `margin-top: 12px`
- `.tag` — same pattern as `Projects.module.css` tag
- `@media (max-width: 960px)` — 2 columns; `@media (max-width: 600px)` — 1 column

- [ ] **Step 2: Implement `app/blog/page.tsx`**

- `export default async function BlogPage()` — Server Component
- Call `getAllPosts()`, render grid of cards
- Each card: `<Image>` (Next.js) for cover, title, date, description, tags
- Card links to `/blog/${post.slug}` via `<Link>`
- Back link `← Home` to `/`
- Export `export const metadata` with `title: 'Blog | Nguyen Tan Dat'`

- [ ] **Step 3: Verify page renders at `/blog` in dev**

```bash
npm run dev
```
Open `http://localhost:3000/blog` — expect card grid with the fixture post.

- [ ] **Step 4: Commit**

```bash
git add app/blog/
git commit -m "feat: add /blog listing page"
```

---

## Task 3: `/blog/[slug]` detail page

**Files:**
- Create: `app/blog/[slug]/page.tsx`
- Create: `app/blog/[slug]/prose.module.css`

**Interfaces:**
- Consumes: `getAllPosts(): BlogPost[]`, `getPostBySlug(slug: string): BlogPostWithContent | null` from `lib/blog.ts`

- [ ] **Step 1: Create `app/blog/[slug]/prose.module.css`**

Styles for:
- `.container` — `max-width: 680px; margin: 0 auto; padding: 80px 24px`
- `.back` — `← All posts` link, `color: var(--accent)`, `font-size: 14px`, `margin-bottom: 40px`
- `.coverImage` — full width, `border-radius: var(--r)`, `margin-bottom: 32px`
- `.meta` — flex row, date + tags, `color: var(--text-3)`, `font-size: 13px`, `margin-bottom: 24px`
- `.title` — `font-size: clamp(28px, 5vw, 44px)`, `font-weight: 800`, `line-height: 1.2`, `margin-bottom: 16px`
- `.prose` — body text container:
  - `font-size: 18px; line-height: 1.8; color: var(--text)`
  - `p { margin-bottom: 1.5em }`
  - `h2 { font-size: 1.5em; font-weight: 700; margin: 2em 0 0.75em }`
  - `h3 { font-size: 1.25em; font-weight: 600; margin: 1.5em 0 0.5em }`
  - `code { background: var(--bg-2); padding: 2px 6px; border-radius: 4px; font-size: 0.9em }`
  - `pre { background: var(--bg-2); padding: 20px; border-radius: var(--r); overflow-x: auto; margin: 1.5em 0 }`
  - `ul, ol { padding-left: 1.5em; margin-bottom: 1.5em }`
  - `li { margin-bottom: 0.5em }`
  - `a { color: var(--accent); text-decoration: underline }`
  - `blockquote { border-left: 3px solid var(--accent); padding-left: 1em; color: var(--text-2); font-style: italic }`

- [ ] **Step 2: Implement `app/blog/[slug]/page.tsx`**

- `export async function generateStaticParams()` — return `getAllPosts().map(p => ({ slug: p.slug }))`
- `export async function generateMetadata({ params })` — `getPostBySlug(params.slug)` → return `{ title, description, openGraph: { images: [post.image] } }`. Return `{}` if post is null.
- `export default async function BlogPostPage({ params })`:
  - Call `getPostBySlug(params.slug)`, call `notFound()` if null
  - Use `MDXRemote` from `next-mdx-remote/rsc` to render `post.content`
  - Layout: back link, cover image, title, meta (date + tags), prose body

- [ ] **Step 3: Verify page renders at `/blog/2026-10-28-welcome-to-my-blog`**

```bash
npm run dev
```
Open `http://localhost:3000/blog/2026-10-28-welcome-to-my-blog` — expect Medium-style reader with fixture content.

- [ ] **Step 4: Verify build passes (SSG)**

```bash
npm run build
```
Expected: `/blog` and `/blog/[slug]` appear in build output as static pages.

- [ ] **Step 5: Commit**

```bash
git add app/blog/[slug]/
git commit -m "feat: add /blog/[slug] reader page"
```

---

## Task 4: Homepage Blog section + Nav + sitemap

**Files:**
- Create: `components/Blog.tsx`
- Create: `components/Blog.module.css`
- Modify: `app/page.tsx`
- Modify: `components/Nav.tsx`
- Modify: `components/Contact.tsx` (secNum 07 → 08)
- Modify: `app/sitemap.ts`

**Interfaces:**
- Consumes: `getAllPosts(): BlogPost[]` from `lib/blog.ts`

- [ ] **Step 1: Create `components/Blog.module.css`**

Styles matching the existing section pattern:
- `.section` — `border-bottom: 1px solid var(--border)`
- `.grid` — same as `/blog` card grid (3/2/1 columns)
- `.card` — same card structure as Task 2
- `.viewAll` — centered link below grid, `color: var(--accent)`, `margin-top: 32px`

- [ ] **Step 2: Implement `components/Blog.tsx`**

- `'use client'` directive — uses `useScrollReveal`
- `import { getAllPosts } from '@/lib/blog'` — **note:** this is a server read; since the component is client, pass posts as props from `page.tsx` instead
  - Signature: `export default function Blog({ posts }: { posts: BlogPost[] })`
- Render section with:
  - `id="blog"`
  - `<div className="secNum">07</div>`
  - `<div className="label">Blog</div>`
  - `<h2>Thoughts on React & React Native</h2>`
  - 3-card grid (same card structure as `/blog` page)
  - `<Link href="/blog">View all posts →</Link>`

- [ ] **Step 3: Update `app/page.tsx`**

- Import `Blog` component
- Call `getAllPosts()` in the page Server Component, take first 3 posts: `const latestPosts = getAllPosts().slice(0, 3)`
- Add `<Blog posts={latestPosts} />` between `<Games />` and `<Contact />`

- [ ] **Step 4: Update `components/Nav.tsx`**

Add to `NAV_ITEMS`:
```ts
{ label: "Blog", href: "#blog" }
```
Add `"blog"` to `SECTION_IDS`. Both arrays: insert before `"contact"` / `{ label: "Contact", ... }`.

- [ ] **Step 5: Update `components/Contact.tsx`**

Change `<div className="secNum">07</div>` → `<div className="secNum">08</div>`

- [ ] **Step 6: Update `app/sitemap.ts`**

```ts
import { getAllPosts } from '@/lib/blog'
```
Add blog post entries to the returned array:
```ts
...getAllPosts().map(post => ({
  url: `https://datdev.vercel.app/blog/${post.slug}`,
  lastModified: new Date(post.date),
  changeFrequency: 'never' as const,
  priority: 0.7,
}))
```

- [ ] **Step 7: Verify homepage renders Blog section and nav scrolls to it**

```bash
npm run dev
```
- Homepage shows Blog section before Contact
- Nav has "Blog" item; clicking scrolls to `#blog`
- "View all posts →" navigates to `/blog`

- [ ] **Step 8: Verify build passes**

```bash
npm run build
```
Expected: clean build, no type errors.

- [ ] **Step 9: Commit**

```bash
git add components/Blog.tsx components/Blog.module.css app/page.tsx components/Nav.tsx components/Contact.tsx app/sitemap.ts
git commit -m "feat: add Blog homepage section, nav link, and sitemap entries"
```

---

## Task 5: GitHub Actions generate-blog workflow

**Files:**
- Create: `.github/workflows/generate-blog.yml`
- Create: `scripts/generate-blog.mjs`
- Modify: `package.json` (add `@google/genai`, `@octokit/rest` to `devDependencies`)

**Interfaces:**
- Consumes: `content/blog/*.mdx` frontmatter for exclusion list
- Produces: new `content/blog/YYYY-MM-DD-slug.mdx` + `public/blog/images/YYYY-MM-DD-slug.png` via PR

- [ ] **Step 1: Install script dependencies**

```bash
npm install --save-dev @google/genai @octokit/rest
```

- [ ] **Step 2: Create `scripts/generate-blog.mjs`**

The script runs in a GitHub Actions Node.js environment with env vars `GEMINI_API_KEY`, `GITHUB_TOKEN`, `REPO_OWNER`, `REPO_NAME`.

Implement these functions in order:

**`getExistingTopics()`**: Read `content/blog/*.mdx` with `fs.readdirSync`. For each file, parse frontmatter with `gray-matter`. Return array of `{ title, tags }` objects. Return `[]` if directory is empty or missing.

**`generateTopic(existingTopics)`**: Call `gemini-3.6-flash` with a prompt that includes the topic pool (11 categories from spec) and the exclusion list. Instruct Gemini to return a JSON object `{ topic: string, angle: string, tags: string[] }`. Parse and return.

**`generateContent(topic, angle, tags)`**: Call `gemini-3.6-flash` with a prompt requesting a blog post in MDX format (no frontmatter — just the body). 500–1000 words. English. Technical depth appropriate for senior React/RN engineers. Return the MDX body string.

**`generateImage(topic, angle)`**: Call `gemini-3.1-flash-image` with a prompt describing the topic visually. Extract the base64 PNG from the response parts. Return `Buffer`.

**`slugify(title)`**: kebab-case, strip special chars, max 60 chars.

**`main()`**:
1. `getExistingTopics()`
2. `generateTopic(existing)` — validate returned topic is not already in existing titles (case-insensitive); if it matches, prepend a warning to the prompt and retry once
3. `generateContent(topic, angle, tags)`
4. `generateImage(topic, angle)`
5. Determine `date = new Date().toISOString().slice(0, 10)`, `slug = slugify(topic)`
6. Write MDX: `content/blog/${date}-${slug}.mdx` with full frontmatter + content
7. Write image: `public/blog/images/${date}-${slug}.png`
8. Use `@octokit/rest` to:
   a. Get default branch SHA
   b. Create branch `blog/${date}-${slug}`
   c. Create blob for MDX file (base64)
   d. Create blob for PNG file (base64)
   e. Create tree with both files
   f. Create commit
   g. Update branch ref
   h. Create PR titled `Blog: ${topic}` targeting `master`

- [ ] **Step 3: Create `.github/workflows/generate-blog.yml`**

```yaml
name: Generate Blog Post
on:
  workflow_dispatch:

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: node scripts/generate-blog.mjs
        env:
          GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
          GITHUB_TOKEN: ${{ secrets.GH_PAT }}
          REPO_OWNER: ${{ github.repository_owner }}
          REPO_NAME: ${{ github.event.repository.name }}
```

- [ ] **Step 4: Verify script runs locally in dry-run mode**

Add a `DRY_RUN=true` env guard in `main()` that skips the GitHub API calls and logs the generated MDX to stdout instead. Run:

```bash
DRY_RUN=true GEMINI_API_KEY=<your_key> node scripts/generate-blog.mjs
```
Expected: generated MDX printed to stdout, no GitHub API calls.

Remove the dry-run guard after verifying (it is a debug path the spec does not call for).

- [ ] **Step 5: Verify TypeScript doesn't break**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add .github/workflows/generate-blog.yml scripts/generate-blog.mjs package.json package-lock.json
git commit -m "feat: add GitHub Actions workflow and blog generation script"
```

---

## Setup Checklist (not a task — done once by the repo owner)

- Add `GEMINI_API_KEY` to GitHub repo Settings → Secrets → Actions
- Add `GH_PAT` (Personal Access Token, `repo` scope) to same location
- Trigger the workflow: GitHub → Actions → "Generate Blog Post" → Run workflow
