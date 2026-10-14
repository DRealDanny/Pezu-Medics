"use client";

import { useState, useEffect } from "react";
import styles from "./CurtainReveal.module.css";

export default function CurtainReveal() {
  const [isDone, setIsDone] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    // Accessibility: Instant bypass for users preferring reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsDone(true);
      return;
    }

    // Safety fallback timer to guarantee full DOM unmount (0.30s stagger + 0.70s duration = 1.00s)
    const timer = setTimeout(() => {
      setIsDone(true);
    }, 1050);

    // Optional event listener to replay curtain reveal on demand for testing
    const handleReplay = () => {
      setIsDone(false);
      setAnimKey((prev) => prev + 1);
    };
    window.addEventListener("pezumedics:replay-curtain", handleReplay);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("pezumedics:replay-curtain", handleReplay);
    };
  }, [animKey]);

  // Self-Destruct on complete: completely unmounts from DOM for zero memory/GPU overhead
  if (isDone) return null;

  return (
    <div
      key={animKey}
      className={styles.curtainWrapper}
      aria-hidden="true"
      role="presentation"
    >
      <div className={styles.curtainColumn} />
      <div className={styles.curtainColumn} />
      <div className={styles.curtainColumn} />
      <div
        className={styles.curtainColumn}
        onAnimationEnd={() => setIsDone(true)}
      />
    </div>
  );
}
