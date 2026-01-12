"use client";
import { useState, FormEvent } from "react";
import styles from "./AdminPage.module.css";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  const ADMIN_PASSWORD =
    process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "wedding2024";

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
    } else {
      alert("Incorrect password");
    }
  };

  if (!authenticated) {
    return (
      <div className={styles.adminLogin}>
        <div className={styles.loginContainer}>
          <h2>Admin Access</h2>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
            />
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminDashboard}>
      <div className={styles.adminHeader}>
        <h1>Wedding RSVP Dashboard</h1>
        <div className={styles.adminActions}>
          <button
            onClick={() => setAuthenticated(false)}
            className={styles.logoutBtn}
          >
            Logout
          </button>
        </div>
      </div>

      <div className={styles.googleSheetsMessage}>
        <div className={styles.messageCard}>
          <h2>📊 Your RSVPs are in Google Sheets!</h2>
          <p>
            All RSVP responses are automatically saved to your Google Sheet in
            real-time.
          </p>

          <div className={styles.instructions}>
            <h3>To View Your RSVPs:</h3>
            <ol>
              <li>Open your Google Sheets</li>
              <li>Find the "Wedding RSVPs" sheet</li>
              <li>
                View all responses with columns:
                <ul>
                  <li>Name</li>
                  <li>Attending (yes/no)</li>
                  <li>Number of Guests</li>
                  <li>Message</li>
                  <li>Timestamp</li>
                  <li>IP Address</li>
                </ul>
              </li>
            </ol>
          </div>

          <div className={styles.benefits}>
            <h3>✨ Google Sheets Benefits:</h3>
            <ul>
              <li>📱 View on any device</li>
              <li>👥 Share with family/wedding planner</li>
              <li>🎨 Add custom columns (seating, dietary needs, etc.)</li>
              <li>📊 Create charts and summaries</li>
              <li>📥 Export to Excel/PDF</li>
              <li>🔄 Real-time updates</li>
            </ul>
          </div>

          <div className={styles.actionButtons}>
            <a
              href="https://sheets.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.primaryButton}
            >
              Open Google Sheets →
            </a>
          </div>

          <div className={styles.helpSection}>
            <p>
              <strong>Can't find your sheet?</strong>
            </p>
            <p>
              Look for the sheet you created when setting up the Google Apps
              Script webhook.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
