"use client";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useState } from "react";
import styles from "./Nav.module.css";

const NAV_ITEMS = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Certs", href: "#certifications" },
  { label: "Contact", href: "#contact" }
];

const SECTION_IDS = [
  "hero",
  "about",
  "skills",
  "experience",
  "projects",
  "certifications",
  "contact"
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const activeId = useActiveSection(SECTION_IDS);

  return (
    <>
      <nav className={styles.nav}>
        <a href="#hero" className={styles.logo}>
          dat<span>.</span>dev
        </a>
        <div className={styles.links}>
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`${styles.link} ${activeId === item.href.slice(1) ? styles.active : ""}`}
            >
              {item.label}
            </a>
          ))}
        </div>
        <a href="#contact" className={styles.cta}>
          Hire Me →
        </a>
        <button
          className={styles.menuBtn}
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "✕" : "☰"}
        </button>
      </nav>

      <div className={`${styles.drawer} ${open ? styles.drawerOpen : ""}`}>
        {NAV_ITEMS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={`${styles.drawerLink} ${activeId === item.href.slice(1) ? styles.drawerLinkActive : ""}`}
            onClick={() => setOpen(false)}
          >
            {item.label}
          </a>
        ))}
      </div>
    </>
  );
}
