"use client";
import { useState } from "react";
import WeddingDetails from "./components/WeddingDetails";
import RSVPForm from "./components/RSVPForm";
import styles from "./Home.module.css";
import "./globals.css";

export default function Home() {
  const [showRSVP, setShowRSVP] = useState(false);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

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

  return (
    <div className={styles.app}>
      <header className={styles.heroSection}>
        <h1>Prabdeep & Saebyeol</h1>
        <h2>Are Getting Married!</h2>
        <p className={styles.date}>
          July 3rd, 2026 • Red Rose Convention Centre
        </p>
      </header>

      <main>
        {!showRSVP ? (
          <>
            <div className={styles.mainContent}>
              <WeddingDetails />
              <div className={styles.rsvpSection}>
                <h3>RSVP Online</h3>
                <p className={styles.rsvpInstruction}>
                  Please confirm your attendance by June 1st, 2026
                </p>
                <button className={styles.rsvpButton} onClick={openRSVPForm}>
                  Click Here to RSVP
                </button>
              </div>
            </div>

            {rsvpSubmitted && (
              <div className={styles.thankYouBanner}>
                <p>
                  ✓ Thank you for your RSVP! We look forward to celebrating with
                  you.
                </p>
              </div>
            )}
          </>
        ) : (
          <RSVPForm
            onBack={() => setShowRSVP(false)}
            onSubmitSuccess={handleRsvpSubmit}
          />
        )}
      </main>

      <footer className={styles.footer}>
        <p>With love, Prabdeep & Saebyeol</p>

        <a href="/admin" className={styles.adminLink}>
          Admin Dashboard
        </a>
      </footer>
    </div>
  );
}
