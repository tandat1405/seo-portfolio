"use client";
import { personal, whatIBring } from "@/data/portfolio";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import Image from "next/image";
import { useRef } from "react";
import styles from "./About.module.css";

export default function About() {
  const ref = useRef<HTMLElement>(null);
  useScrollReveal(ref);

  return (
    <section id="about" className={styles.section} ref={ref}>
      <div className="secNum">01</div>
      <div className="label">About</div>
      <h2>Who I am</h2>
      <div className={styles.grid}>
        <div className={styles.leftCol}>
          <div className={`${styles.card} fu`}>
            <div className={styles.cardHead}>
              <div className={styles.cardIcon}>
                <Image src="/hi.png" alt="background" width={24} height={24} />
              </div>
              <div className={styles.cardTitle}>Background</div>
            </div>
            <p className={styles.cardP}>
              Senior React Native Engineer with 8+ years building
              production-grade apps across healthcare, real estate, sports and
              telecom. I&apos;ve led cross-functional teams and shipped directly
              to App Store and Play Store for US, UK, Japanese and Australian
              clients. Exposure to backend technologies including Node.js and
              Spring Boot; actively expanding backend proficiency alongside
              primary frontend and mobile expertise.
            </p>
            <br />
            <p className={styles.cardP}>
              Currently pioneering AI-assisted development workflows to
              accelerate architecture design, code review and feature delivery
              at scale.
            </p>
          </div>
          <a
            href={personal.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.photoStrip} fu`}
          >
            <Image
              src="/photo.jpg"
              alt={personal.name}
              width={600}
              height={400}
              className={styles.photo}
            />
            <div className={styles.overlay} />
            <div className={styles.photoLabel}>
              <div>
                <div className={styles.aplContext}>Mobile · Frontend</div>
                <div className={styles.aplName}>{personal.name}</div>
                <div className={styles.aplRole}>{personal.location}</div>
              </div>
              <div className={styles.aplRight}>
                <div className={styles.aplTag}>Open to work →</div>
                <div className={styles.aplDot}>Available remotely</div>
              </div>
            </div>
          </a>
        </div>
        <div className={`${styles.card} fu`}>
          <div className={styles.cardHead}>
            <div className={styles.cardIcon}>
              <Image
                src="/idea.png"
                alt="what I bring"
                width={24}
                height={24}
              />
            </div>
            <div className={styles.cardTitle}>What I bring</div>
          </div>
          <div className={styles.listItems}>
            {whatIBring.map((item) => (
              <div key={item} className={styles.li}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
