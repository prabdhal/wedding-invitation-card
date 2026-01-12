"use client";
import { useState, FormEvent, ChangeEvent, useEffect, useRef } from "react";
import styles from "./RSVPForm.module.css"; // Import CSS module

interface RSVPFormData {
  name: string;
  attending: "yes" | "no";
  guests: number;
}

interface RSVPFormProps {
  onBack: () => void;
  onSubmitSuccess: () => void;
}

// Predefined guest list
const GUEST_LIST = [
  "Tejpartap Samra",
  "Manjit Singh",
  "Dongsin Lee",
  "Jongpil Seo",
  "Moojin Cho",
  "Hansom Lee",
  "Becky Park",
  "Karan Grewal",
  "Darshan Grewal",
  "Abhinav Mohan",
  "Pama Dhaliwal",
  "Andy Zheng",
];

export default function RSVPForm({ onBack, onSubmitSuccess }: RSVPFormProps) {
  const [formData, setFormData] = useState<RSVPFormData>({
    name: "",
    attending: "yes",
    guests: 1,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredGuests, setFilteredGuests] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [hasSelectedFromDropdown, setHasSelectedFromDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter guests based on input
  useEffect(() => {
    if (inputValue.trim() === "") {
      setFilteredGuests([]);
    } else {
      const filtered = GUEST_LIST.filter((guest) =>
        guest.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredGuests(filtered);

      // Show dropdown only if there are matches and user hasn't selected from it
      if (filtered.length > 0 && !hasSelectedFromDropdown) {
        setShowDropdown(true);
      } else {
        setShowDropdown(false);
      }
    }
  }, [inputValue, hasSelectedFromDropdown]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setFormData((prev) => ({ ...prev, name: value }));

    // Reset dropdown selection flag when user starts typing again
    if (value !== formData.name) {
      setHasSelectedFromDropdown(false);
    }
  };

  const selectGuest = (guestName: string) => {
    setFormData((prev) => ({ ...prev, name: guestName }));
    setInputValue(guestName);
    setShowDropdown(false);
    setHasSelectedFromDropdown(true);
    setFilteredGuests([]); // Clear filtered guests after selection
  };

  const handleNameInputClick = () => {
    // Only show dropdown if user hasn't selected from it yet
    if (!hasSelectedFromDropdown && inputValue.trim() === "") {
      setFilteredGuests(GUEST_LIST);
      setShowDropdown(true);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "guests" ? parseInt(value) : value,
    }));
  };

  const handleRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value as "yes" | "no",
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate name is in guest list and not empty
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      setError("Please enter your name.");
      setLoading(false);
      return;
    }

    if (!GUEST_LIST.includes(trimmedName)) {
      setError(
        "Please select your name from the list. The name must match exactly."
      );
      setLoading(false);
      setShowDropdown(true);
      setHasSelectedFromDropdown(false);
      return;
    }

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          name: trimmedName,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit RSVP");
      }

      const data = await response.json();
      console.log("RSVP submitted:", data);

      // Reset form
      setFormData({
        name: "",
        attending: "yes",
        guests: 1,
      });
      setInputValue("");
      setHasSelectedFromDropdown(false);

      onSubmitSuccess();
      onBack();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Keyboard navigation for dropdown
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" && filteredGuests.length > 0) {
      e.preventDefault();
      const firstItem = document.querySelector(
        `.${styles.dropdownItem}`
      ) as HTMLElement;
      firstItem?.focus();
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  return (
    <div className={styles.rsvpFormContainer}>
      <button onClick={onBack} className={styles.backButton}>
        ← Back to Invitation
      </button>

      <h2 id="rsvp-header">Wedding RSVP</h2>
      <p className={styles.formInstructions}>
        Please fill out this form by June 1st, 2026
      </p>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <form
        onSubmit={handleSubmit}
        className={styles.rsvpForm}
        // These form attributes help prevent Chrome autofill
        autoComplete="off"
      >
        {/* Hidden dummy inputs to trick Chrome */}
        <div style={{ display: "none" }}>
          <input type="text" name="fakeusername" />
          <input type="password" name="fakepassword" />
        </div>

        <div className={styles.formGroup} ref={dropdownRef}>
          <label htmlFor="name">Full Name *</label>
          <div className={styles.dropdownWrapper}>
            <input
              ref={inputRef}
              type="text"
              id="name"
              name="name"
              value={inputValue}
              onChange={handleNameChange}
              onClick={handleNameInputClick}
              onFocus={() => {
                // Only show dropdown on focus if input is empty and no selection made
                if (inputValue.trim() === "" && !hasSelectedFromDropdown) {
                  setFilteredGuests(GUEST_LIST);
                  setShowDropdown(true);
                }
              }}
              onKeyDown={handleKeyDown}
              required
              placeholder="Select your name from the list"
              // MULTIPLE techniques to disable Chrome autofill
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              // Randomize the "name" attribute to prevent Chrome from recognizing it
              data-lpignore="true"
              data-form-type="other"
              // Additional attributes
              aria-autocomplete="none"
              aria-expanded={showDropdown}
              aria-controls="guest-dropdown"
              // Use a non-standard attribute name
              data-autocomplete="off"
            />

            {showDropdown && filteredGuests.length > 0 && (
              <div
                className={styles.dropdownMenu}
                id="guest-dropdown"
                role="listbox"
              >
                {filteredGuests.map((guest) => (
                  <div
                    key={guest}
                    className={styles.dropdownItem}
                    onClick={() => selectGuest(guest)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        selectGuest(guest);
                      }
                    }}
                    tabIndex={0}
                    role="option"
                    aria-selected={formData.name === guest}
                  >
                    {guest}
                  </div>
                ))}
              </div>
            )}

            {showDropdown &&
              filteredGuests.length === 0 &&
              inputValue.trim() !== "" && (
                <div className={`${styles.dropdownMenu} ${styles.noResults}`}>
                  <div className={styles.dropdownItem}>
                    No matching names found. Please select from the list.
                  </div>
                </div>
              )}
          </div>
          <p className={styles.hintText}>
            Click the field to see all {GUEST_LIST.length} guests
          </p>
        </div>

        <div className={styles.formGroup}>
          <label>Will you be attending? *</label>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="attending"
                value="yes"
                checked={formData.attending === "yes"}
                onChange={handleRadioChange}
              />
              <span className={styles.radioCustom}></span>
              Yes, I/We will attend
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="attending"
                value="no"
                checked={formData.attending === "no"}
                onChange={handleRadioChange}
              />
              <span className={styles.radioCustom}></span>
              No, I/We cannot attend
            </label>
          </div>
        </div>

        {formData.attending === "yes" && (
          <div className={styles.formGroup}>
            <label htmlFor="guests">Number of Guests (1-8) *</label>
            <select
              id="guests"
              name="guests"
              value={formData.guests}
              onChange={handleChange}
              required
              autoComplete="off"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? "guest" : "guests"}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit RSVP"}
        </button>
      </form>
    </div>
  );
}
