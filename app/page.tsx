"use client";
import { useState } from "react";
import WeddingDetails from "./components/WeddingDetails";
import RSVPForm from "./components/RSVPForm";
import ConfettiEffect from "./components/ConfettiEffect";
import EnvelopeAnimation from "./components/EnvelopeAnimation";
import { useScrollAnimation } from "./hooks/useScrollAnimation";
import styles from "./Home.module.css";
import "./globals.css";

export default function Home() {
  const [showRSVP, setShowRSVP] = useState(false);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [showContent, setShowContent] = useState(false);

  // Scroll animations for different sections
  const heroAnimation = useScrollAnimation({ threshold: 0.3 });
  const detailsAnimation = useScrollAnimation({ threshold: 0.2 });
  const rsvpAnimation = useScrollAnimation({ threshold: 0.2 });

  const handleRsvpSubmit = () => {
    setRsvpSubmitted(true);
  };

  const openRSVPForm = () => {
    setShowRSVP(true);
    setTimeout(() => {
      const form = document.getElementById("rsvp-header");
      if (form) {
        form.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 0);
  };

  const handleAnimationComplete = () => {
    setShowContent(true);
  };

  return (
    <>
      {!showContent && (
        <EnvelopeAnimation onComplete={handleAnimationComplete} />
      )}

      <div
        className={`${styles.app} ${
          showContent ? styles.contentVisible : styles.contentHidden
        }`}
      >
        <ConfettiEffect trigger={rsvpSubmitted} />

        <header
          ref={heroAnimation.elementRef}
          className={`${styles.heroSection} ${
            heroAnimation.isVisible ? styles.fadeInUp : ""
          }`}
        >
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Prabdeep & Saebyeol</h1>
            <h2 className={styles.heroSubtitle}>Are Getting Married!</h2>
            <p className={styles.date}>
              July 3rd, 2026 • Red Rose Convention Centre
            </p>
          </div>
        </header>

        <main>
          {!showRSVP ? (
            <>
              <div className={styles.mainContent}>
                <div
                  ref={detailsAnimation.elementRef}
                  className={`${styles.detailsWrapper} ${
                    detailsAnimation.isVisible ? styles.fadeInLeft : ""
                  }`}
                >
                  <WeddingDetails />
                </div>

                <div
                  ref={rsvpAnimation.elementRef}
                  className={`${styles.rsvpWrapper} ${
                    rsvpAnimation.isVisible ? styles.fadeInRight : ""
                  }`}
                >
                  <div className={styles.rsvpSection}>
                    <h3>RSVP Online</h3>
                    <p className={styles.rsvpInstruction}>
                      Please confirm your attendance by June 1st, 2026
                    </p>
                    <button
                      className={styles.rsvpButton}
                      onClick={openRSVPForm}
                    >
                      Click Here to RSVP
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className={styles.formWrapper}>
              <RSVPForm
                onBack={() => setShowRSVP(false)}
                onSubmitSuccess={handleRsvpSubmit}
              />
            </div>
          )}
        </main>

        <footer className={styles.footer}>
          <p>With love, Prabdeep & Saebyeol</p>
        </footer>
      </div>
    </>
  );
}
