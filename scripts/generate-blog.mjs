import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { GoogleGenAI } from '@google/genai'
import { Octokit } from '@octokit/rest'

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')
const IMAGES_DIR = path.join(process.cwd(), 'public', 'blog', 'images')

const TEXT_MODELS = ['gemini-3.6-flash', 'gemini-2.0-flash', 'gemini-1.5-flash']
const IMAGE_MODELS = ['gemini-3.1-flash-image', 'gemini-3.1-flash-lite-image']

const TOPIC_POOL = [
  'React Native fundamentals',
  'React fundamentals',
  'React Native latest updates',
  'React latest updates',
  'React Native architecture comparisons (Expo vs bare, new arch vs old arch)',
  'React architecture patterns (feature-sliced, atomic, monorepo)',
  'React Native vs React for shared logic',
  'React Native vs Flutter, Ionic, and other cross-platform frameworks',
  'React vs Vue, Svelte, Angular, and other web frameworks',
  'React Native performance deep-dives',
  'React hooks patterns',
]

async function callWithFallback(models, fn, retriesPerModel = 2) {
  for (const model of models) {
    for (let attempt = 0; attempt < retriesPerModel; attempt++) {
      try {
        return await fn(model)
      } catch (err) {
        const isUnavailable =
          err?.status === 503 ||
          err?.message?.includes('503') ||
          err?.message?.includes('UNAVAILABLE') ||
          err?.message?.includes('high demand')
        if (!isUnavailable) throw err
        if (attempt < retriesPerModel - 1) {
          const delay = Math.pow(2, attempt + 1) * 1000
          console.log(`Model ${model} unavailable, retrying in ${delay / 1000}s...`)
          await new Promise((r) => setTimeout(r, delay))
        } else {
          console.log(`Model ${model} exhausted retries, trying next fallback...`)
        }
      }
    }
  }
  throw new Error(`All models exhausted: ${models.join(', ')}`)
}

function getExistingTopics() {
  if (!fs.existsSync(BLOG_DIR)) return []
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'))
  return files.map((filename) => {
    const raw = fs.readFileSync(path.join(BLOG_DIR, filename), 'utf-8')
    const { data } = matter(raw)
    return { title: data.title ?? '', tags: data.tags ?? [] }
  })
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60)
}

async function generateTopic(ai, existingTopics, retryWithWarning = false) {
  const exclusionList = existingTopics.map((t) => `- ${t.title}`).join('\n')
  const warningPrefix = retryWithWarning
    ? 'IMPORTANT: The previous topic you suggested was already covered. You MUST choose a different one.\n\n'
    : ''

  const prompt = `${warningPrefix}You are a senior React and React Native engineer writing a technical blog.

Choose ONE topic from the following pool for a new blog post:
${TOPIC_POOL.map((t) => `- ${t}`).join('\n')}

${exclusionList ? `These topics have already been covered (do NOT pick them or anything too similar):\n${exclusionList}\n` : ''}

Return a JSON object ONLY (no markdown, no explanation):
{
  "topic": "specific focused blog post title (max 60 chars)",
  "angle": "one sentence describing the unique angle or argument of this post",
  "tags": ["tag1", "tag2", "tag3"]
}`

  const result = await callWithFallback(TEXT_MODELS, (model) =>
    ai.models.generateContent({ model, contents: prompt })
  )

  if (!result.text) {
    throw new Error('Gemini returned no text for topic generation (possible safety block)')
  }

  let parsed
  try {
    const text = result.text.trim().replace(/^```json\n?/, '').replace(/\n?```$/, '')
    parsed = JSON.parse(text)
  } catch {
    throw new Error(`Gemini returned non-JSON for topic generation:\n${result.text}`)
  }
  return parsed
}

async function generateContent(ai, topic, angle) {
  const prompt = `Write a technical blog post for senior React and React Native engineers.

Title: "${topic}"
Angle: ${angle}

Requirements:
- 500–1000 words
- English
- MDX body only (NO frontmatter, NO title heading at top)
- Start with a compelling opening paragraph
- Use ## for section headings, ### for subsections
- Include code examples where relevant using fenced code blocks
- End with a practical takeaway or conclusion
- Technical depth appropriate for senior engineers`

  const result = await callWithFallback(TEXT_MODELS, (model) =>
    ai.models.generateContent({ model, contents: prompt })
  )

  return result.text.trim()
}

async function generateImage(ai, topic, angle) {
  const prompt = `Create a clean, professional tech blog cover image for an article titled "${topic}".
${angle}
Style: modern, minimal, dark background with blue accents, abstract geometric shapes representing code/architecture.
No text, no logos. 1200x630 aspect ratio composition.`

  const result = await callWithFallback(IMAGE_MODELS, (model) =>
    ai.models.generateContent({ model, contents: prompt })
  )

  const imagePart = result.candidates?.[0]?.content?.parts?.find(
    (p) => p.inlineData?.mimeType?.startsWith('image/')
  )

  if (!imagePart?.inlineData?.data) {
    throw new Error('No image data returned from Gemini image model')
  }

  return Buffer.from(imagePart.inlineData.data, 'base64')
}

async function openPR(octokit, owner, repo, branchName, date, slug, topic, mdxPath, imgPath) {
  const { data: refData } = await octokit.git.getRef({
    owner,
    repo,
    ref: 'heads/master',
  })
  const baseSha = refData.object.sha

  const mdxContent = fs.readFileSync(mdxPath, 'utf-8')
  const imgContent = fs.readFileSync(imgPath)

  const { data: mdxBlob } = await octokit.git.createBlob({
    owner,
    repo,
    content: Buffer.from(mdxContent).toString('base64'),
    encoding: 'base64',
  })

  const { data: imgBlob } = await octokit.git.createBlob({
    owner,
    repo,
    content: imgContent.toString('base64'),
    encoding: 'base64',
  })

  const { data: baseCommit } = await octokit.git.getCommit({
    owner,
    repo,
    commit_sha: baseSha,
  })

  const { data: tree } = await octokit.git.createTree({
    owner,
    repo,
    base_tree: baseCommit.tree.sha,
    tree: [
      {
        path: `content/blog/${date}-${slug}.mdx`,
        mode: '100644',
        type: 'blob',
        sha: mdxBlob.sha,
      },
      {
        path: `public/blog/images/${date}-${slug}.png`,
        mode: '100644',
        type: 'blob',
        sha: imgBlob.sha,
      },
    ],
  })

  const { data: commit } = await octokit.git.createCommit({
    owner,
    repo,
    message: `blog: add "${topic}"`,
    tree: tree.sha,
    parents: [baseSha],
  })

  await octokit.git.createRef({
    owner,
    repo,
    ref: `refs/heads/${branchName}`,
    sha: commit.sha,
  })

  const { data: pr } = await octokit.pulls.create({
    owner,
    repo,
    title: `Blog: ${topic}`,
    head: branchName,
    base: 'master',
    body: `AI-generated blog post about: **${topic}**\n\nReview the post and cover image in the Vercel preview before merging.`,
  })

  return pr.html_url
}

async function main() {
  const apiKey = process.env.GEMINI_API_KEY
  const githubToken = process.env.GITHUB_TOKEN
  const owner = process.env.REPO_OWNER
  const repo = process.env.REPO_NAME

  if (!apiKey) throw new Error('GEMINI_API_KEY is required')
  if (!githubToken || !owner || !repo) throw new Error('GITHUB_TOKEN, REPO_OWNER, REPO_NAME are required')

  const ai = new GoogleGenAI({ apiKey })
  const octokit = new Octokit({ auth: githubToken })

  console.log('Reading existing posts...')
  const existingTopics = getExistingTopics()
  console.log(`Found ${existingTopics.length} existing posts`)

  console.log('Generating topic...')
  let topicData = await generateTopic(ai, existingTopics)

  const isDuplicate = (data) =>
    existingTopics.some((t) => t.title.toLowerCase() === data.topic.toLowerCase())

  if (isDuplicate(topicData)) {
    console.log('Topic was duplicate, retrying...')
    topicData = await generateTopic(ai, existingTopics, true)
    if (isDuplicate(topicData)) {
      throw new Error(`Gemini returned a duplicate topic after retry: "${topicData.topic}"`)
    }
  }

  console.log(`Topic: ${topicData.topic}`)
  console.log(`Angle: ${topicData.angle}`)

  console.log('Generating content...')
  const content = await generateContent(ai, topicData.topic, topicData.angle)

  console.log('Generating image...')
  const imageBuffer = await generateImage(ai, topicData.topic, topicData.angle)

  const date = new Date().toISOString().slice(0, 10)
  const slug = slugify(topicData.topic)
  const branchName = `blog/${date}-${slug}`

  const mdxFrontmatter = `---
title: "${topicData.topic.replace(/"/g, '\\"')}"
date: "${date}"
description: "${topicData.angle.replace(/"/g, '\\"')}"
tags: ${JSON.stringify(topicData.tags)}
image: "/blog/images/${date}-${slug}.png"
---

`

  fs.mkdirSync(BLOG_DIR, { recursive: true })
  fs.mkdirSync(IMAGES_DIR, { recursive: true })

  const mdxPath = path.join(BLOG_DIR, `${date}-${slug}.mdx`)
  const imgPath = path.join(IMAGES_DIR, `${date}-${slug}.png`)

  fs.writeFileSync(mdxPath, mdxFrontmatter + content, 'utf-8')
  fs.writeFileSync(imgPath, imageBuffer)

  console.log(`Written: ${mdxPath}`)
  console.log(`Written: ${imgPath}`)

  console.log('Opening PR...')
  const prUrl = await openPR(octokit, owner, repo, branchName, date, slug, topicData.topic, mdxPath, imgPath)
  console.log(`PR opened: ${prUrl}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
