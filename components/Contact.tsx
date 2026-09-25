"use client";
import { personal } from "@/data/portfolio";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { FormEvent, useRef } from "react";
import styles from "./Contact.module.css";

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  useScrollReveal(ref);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const message = (form.elements.namedItem("message") as HTMLTextAreaElement)
      .value;
    const body = `From: ${name} <${email}>\n\n${message}`;
    window.location.href = `mailto:${personal.email}?subject=Portfolio inquiry from ${encodeURIComponent(name)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <section id="contact" className={styles.section} ref={ref}>
      <div className="secNum">07</div>
      <div className="label">Contact</div>
      <h2>Let&apos;s build something</h2>
      <div className={styles.split}>
        <div className="fu">
          <h3 className={styles.heading}>
            Open to new
            <br />
            opportunities.
          </h3>
          <p className={styles.p}>
            Whether you need a mobile app, a web platform, or a long-term
            development partner — I&apos;d love to hear from you. Currently
            available for freelance and full-time roles.
          </p>
          <div className={styles.socials}>
            <a
              href={personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.soc}
            >
              <div className={styles.socIcon}>🔗</div>{" "}
              {personal.linkedin.replace("https://", "")}
            </a>
            <a href={`mailto:${personal.email}`} className={styles.soc}>
              <div className={styles.socIcon}>✉️</div> {personal.email}
            </a>
          </div>
        </div>
        <div className="fu">
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.fg}>
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Your name"
                className={styles.input}
                required
              />
            </div>
            <div className={styles.fg}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                className={styles.input}
                required
              />
            </div>
            <div className={styles.fg}>
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                placeholder="Tell me about your project..."
                className={styles.textarea}
                required
              />
            </div>
            <button type="submit" className={styles.submit}>
              Send Message →
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
