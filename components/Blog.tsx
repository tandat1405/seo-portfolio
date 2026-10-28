'use client'
import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import type { BlogPost } from '@/lib/blog'
import styles from './Blog.module.css'

export default function Blog({ posts }: { posts: BlogPost[] }) {
  const ref = useRef<HTMLElement>(null)
  useScrollReveal(ref)

  return (
    <section id="blog" className={styles.section} ref={ref}>
      <div className="secNum">07</div>
      <div className="label">Blog</div>
      <h2>Thoughts on React &amp; React Native</h2>
      <div className={styles.grid}>
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className={`${styles.card} fu`}>
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
      <Link href="/blog" className={styles.viewAll}>View all posts →</Link>
    </section>
  )
}
