"use client";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import Link from "next/link";
import { useRef } from "react";
import styles from "./Games.module.css";

const GAMES = [
  {
    href: "/games/flappy",
    emoji: "🐦",
    name: "Flappy Bird",
    desc: "Tap to flap. Dodge the pipes.",
    hint: "Space / tap"
  },
  {
    href: "/games/memory",
    emoji: "🃏",
    name: "Memory Match",
    desc: "Flip cards. Find all pairs.",
    hint: "Click to flip"
  },
  {
    href: "/games/2048",
    emoji: "🧩",
    name: "2048",
    desc: "Slide tiles. Reach 2048.",
    hint: "WASD / arrows"
  }
];

export default function Games() {
  const ref = useRef<HTMLElement>(null);
  useScrollReveal(ref);

  return (
    <section id="games" className={styles.section} ref={ref}>
      <div className="secNum">06</div>
      <div className="label">Mini Games</div>
      <h2>Take a break — play a game before contacting me</h2>
      <div className={styles.grid}>
        {GAMES.map((g) => (
          <Link key={g.href} href={g.href} className={`${styles.card} fu`}>
            <span className={styles.emoji}>{g.emoji}</span>
            <div className={styles.name}>{g.name}</div>
            <div className={styles.desc}>{g.desc}</div>
            <span className={styles.hint}>{g.hint}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
