"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./CurtainReveal.module.css";

gsap.registerPlugin(useGSAP);

export default function CurtainReveal() {
  const [isDone, setIsDone] = useState(false);
  const containerRef = useRef(null);

  useGSAP(
    () => {
      if (isDone) return;

      // Accessibility: Instant bypass for users preferring reduced motion
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setIsDone(true);
        return;
      }

      // Animate the 4 columns upward off-screen with left-to-right stagger
      gsap.to(".curtain-column", {
        yPercent: -100,
        duration: 0.85,
        stagger: 0.12,
        delay: 0.1,
        ease: "expo.inOut",
        force3D: true,
        onComplete: () => {
          setIsDone(true);
        },
      });
    },
    { scope: containerRef, dependencies: [isDone] }
  );

  // Optional event listener to replay curtain reveal on demand for testing
  useEffect(() => {
    const handleReplay = () => setIsDone(false);
    window.addEventListener("pezumedics:replay-curtain", handleReplay);
    return () => window.removeEventListener("pezumedics:replay-curtain", handleReplay);
  }, []);

  // Self-Destruct on complete: completely unmounts from DOM for zero memory/GPU overhead
  if (isDone) return null;

  return (
    <div
      ref={containerRef}
      className={styles.curtainWrapper}
      aria-hidden="true"
      role="presentation"
    >
      <div className={`curtain-column ${styles.curtainColumn}`} />
      <div className={`curtain-column ${styles.curtainColumn}`} />
      <div className={`curtain-column ${styles.curtainColumn}`} />
      <div className={`curtain-column ${styles.curtainColumn}`} />
    </div>
  );
}
