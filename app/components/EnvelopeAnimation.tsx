"use client";
import { useEffect, useState } from "react";
import styles from "./EnvelopeAnimation.module.css";

interface EnvelopeAnimationProps {
  onComplete: () => void;
}

export default function EnvelopeAnimation({
  onComplete,
}: EnvelopeAnimationProps) {
  const [animationStage, setAnimationStage] = useState<
    "envelope" | "opening" | "letter-rising" | "expanding" | "complete"
  >("envelope");

  useEffect(() => {
    // Sequence the animation stages
    const timer1 = setTimeout(() => setAnimationStage("opening"), 500);
    const timer2 = setTimeout(() => setAnimationStage("letter-rising"), 1800);
    const timer3 = setTimeout(() => setAnimationStage("expanding"), 2800);
    const timer4 = setTimeout(() => {
      setAnimationStage("complete");
      onComplete();
    }, 3800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  if (animationStage === "complete") return null;

  return (
    <div className={styles.envelopeContainer}>
      {/* Floating decorative hearts */}
      <div className={styles.floatingHearts}>
        <div className={styles.heart}></div>
        <div className={styles.heart}></div>
        <div className={styles.heart}></div>
        <div className={styles.heart}></div>
      </div>

      <div className={styles.envelopeWrapper}>
        {/* Letter inside - only visible when rising */}
        <div
          className={`${styles.letter} ${
            animationStage === "letter-rising" || animationStage === "expanding"
              ? styles.rising
              : ""
          } ${animationStage === "expanding" ? styles.expanding : ""}`}
        >
          <div className={styles.letterContent}>
            <div className={styles.letterHeader}>
              <div className={styles.flowerDecor}></div>
              <h1 className={styles.coupleNames}>Prabdeep & Saebyeol</h1>
              <div className={styles.flowerDecor}></div>
            </div>
            <p className={styles.letterSubtext}>Are Getting Married!</p>
            <div className={styles.letterDate}>July 3rd, 2026</div>
          </div>
        </div>

        {/* Envelope back */}
        <div className={styles.envelopeBack}></div>

        {/* Envelope flap */}
        <div
          className={`${styles.envelopeFlap} ${
            animationStage === "opening" ||
            animationStage === "letter-rising" ||
            animationStage === "expanding"
              ? styles.open
              : ""
          }`}
        >
          <div className={styles.flapSeal}>
            <div className={styles.sealInner}></div>
          </div>
        </div>

        {/* Envelope front */}
        <div className={styles.envelopeFront}></div>
      </div>

      {/* Sparkle effects */}
      <div className={styles.sparkles}>
        <div className={styles.sparkle}></div>
        <div className={styles.sparkle}></div>
        <div className={styles.sparkle}></div>
        <div className={styles.sparkle}></div>
        <div className={styles.sparkle}></div>
        <div className={styles.sparkle}></div>
      </div>
    </div>
  );
}
