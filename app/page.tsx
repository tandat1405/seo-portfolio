import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Skills from '@/components/Skills'
import Experience from '@/components/Experience'
import Projects from '@/components/Projects'
import Certifications from '@/components/Certifications'
import Games from '@/components/Games'
import Blog from '@/components/Blog'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import { getAllPosts } from '@/lib/blog'

export default function Home() {
  const latestPosts = getAllPosts().slice(0, 3)

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Certifications />
        <Games />
        <Blog posts={latestPosts} />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
