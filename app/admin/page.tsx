"use client";
import { useState, useEffect, FormEvent } from "react";
import { RSVPFormData, RSVPSummary } from "@/types";
import styles from "./AdminPage.module.css"; // Import CSS module

export default function AdminPage() {
  const [rsvps, setRsvps] = useState<RSVPFormData[]>([]);
  const [summary, setSummary] = useState<RSVPSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  // In production, use environment variables
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

  useEffect(() => {
    if (authenticated) {
      fetchRSVPs();
    }
  }, [authenticated]);

  const fetchRSVPs = async () => {
    try {
      const response = await fetch("/api/rsvp");
      if (!response.ok) throw new Error("Failed to fetch RSVPs");

      const data = await response.json();
      setRsvps(data.rsvps);
      setSummary(data.summary);
    } catch (error) {
      console.error("Error fetching RSVPs:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Attending",
      "Guests",
      "Dietary",
      "Message",
      "Date",
    ];
    const csvRows = [
      headers.join(","),
      ...rsvps.map((rsvp) =>
        [
          `"${rsvp.name?.replace(/"/g, '""')}"`,
          `"${rsvp.email?.replace(/"/g, '""')}"`,
          `"${rsvp.phone?.replace(/"/g, '""')}"`,
          `"${rsvp.attending}"`,
          rsvp.guests,
          `"${rsvp.dietary?.replace(/"/g, '""')}"`,
          `"${rsvp.message?.replace(/"/g, '""')}"`,
          `"${
            rsvp.timestamp ? new Date(rsvp.timestamp).toLocaleDateString() : ""
          }"`,
        ].join(",")
      ),
    ];

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "wedding-rsvps.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          <button onClick={fetchRSVPs} className={styles.refreshBtn}>
            Refresh
          </button>
          <button onClick={exportToCSV} className={styles.exportBtn}>
            Export to CSV
          </button>
          <button
            onClick={() => setAuthenticated(false)}
            className={styles.logoutBtn}
          >
            Logout
          </button>
        </div>
      </div>

      {summary && (
        <div className={styles.summaryCards}>
          <div className={styles.summaryCard}>
            <h3>Total RSVPs</h3>
            <p className={styles.summaryNumber}>{summary.total}</p>
          </div>
          <div className={`${styles.summaryCard} ${styles.attending}`}>
            <h3>Attending</h3>
            <p className={styles.summaryNumber}>{summary.attending}</p>
          </div>
          <div className={`${styles.summaryCard} ${styles.declined}`}>
            <h3>Declined</h3>
            <p className={styles.summaryNumber}>{summary.declined}</p>
          </div>
          <div className={`${styles.summaryCard} ${styles.guests}`}>
            <h3>Total Guests</h3>
            <p className={styles.summaryNumber}>{summary.totalGuests}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className={styles.loading}>Loading RSVPs...</div>
      ) : (
        <div className={styles.rsvpList}>
          <h2>All RSVPs ({rsvps.length})</h2>
          <div className={styles.tableContainer}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Attending</th>
                  <th>Guests</th>
                  <th>Dietary</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {rsvps.map((rsvp) => (
                  <tr key={rsvp.id}>
                    <td>{rsvp.name}</td>
                    <td>{rsvp.email}</td>
                    <td>
                      <span
                        className={`${styles.status} ${styles[rsvp.attending]}`}
                      >
                        {rsvp.attending === "yes"
                          ? "✓ Attending"
                          : "✗ Declined"}
                      </span>
                    </td>
                    <td>{rsvp.guests}</td>
                    <td>{rsvp.dietary || "-"}</td>
                    <td>
                      {rsvp.timestamp
                        ? new Date(rsvp.timestamp).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
