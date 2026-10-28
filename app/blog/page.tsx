import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getAllPosts } from '@/lib/blog'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Blog | Nguyen Tan Dat',
  description: 'Thoughts on React and React Native — fundamentals, architecture, and comparisons.',
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div className={styles.page}>
      <Link href="/" className={styles.back}>← Home</Link>
      <h1 className={styles.heading}>Blog</h1>
      <div className={styles.grid}>
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.card}>
            <div className={styles.cardImage}>
              <Image
                src={post.image}
                alt={post.title}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw"
              />
            </div>
            <div className={styles.cardBody}>
              <div className={styles.cardTitle}>{post.title}</div>
              <div className={styles.cardDesc}>{post.description}</div>
              <div className={styles.cardMeta}>
                <span className={styles.cardDate}>{post.date}</span>
                <div className={styles.tags}>
                  {post.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
