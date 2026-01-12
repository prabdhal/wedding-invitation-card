import styles from "./WeddingDetails.module.css"; // Import CSS module

export default function WeddingDetails() {
  const venueAddress = "1233 Derry Rd E, Mississauga, ON L5T 1B6";
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    venueAddress
  )}`;

  return (
    <div className={styles.detailsCard}>
      <h3>Wedding Details</h3>
      <p>
        <strong>Date:</strong> July 3rd, 2026
      </p>
      <p>
        <strong>Time:</strong> 6:00 PM
      </p>
      <p>
        <strong>Venue:</strong> Red Rose Convention Centre
      </p>
      <p>
        <strong>Address:</strong> {venueAddress}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.directionsLink}
        >
          Get Directions ↗
        </a>
      </p>

      <div className={styles.schedule}>
        <h4>Schedule</h4>
        <ul>
          <li>6:00 PM - Cocktail Hour</li>
          <li>7:00 PM - Appetizer Service</li>
          <li>8:00 PM - Entrances & Performances</li>
          <li>10:00 PM - Dance Floor Opens</li>
          <li>1:00 AM - Event Ends</li>
        </ul>
      </div>
    </div>
  );
}
