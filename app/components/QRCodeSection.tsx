"use client";
import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import styles from "./QRCodeSection.module.css"; // Import CSS module

export default function QRCodeSection() {
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setCurrentUrl(window.location.origin);
  }, []);

  return (
    <div className={styles.qrPrintOnly}>
      <div className={styles.qrCode}>
        <QRCodeSVG
          value={currentUrl}
          size={200}
          level="H"
          includeMargin={true}
        />
      </div>
      <p className={styles.qrLabel}>Scan to RSVP Online</p>
    </div>
  );
}
