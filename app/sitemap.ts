import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/blog'

export default function sitemap(): MetadataRoute.Sitemap {
  const blogEntries = getAllPosts().map((post) => ({
    url: `https://datdev.vercel.app/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'never' as const,
    priority: 0.7,
  }))

  return [
    {
      url: 'https://datdev.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...blogEntries,
  ]
}
