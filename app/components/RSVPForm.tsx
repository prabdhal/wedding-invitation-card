"use client";
import { useState, FormEvent, ChangeEvent, useEffect, useRef } from "react";
import styles from "./RSVPForm.module.css"; // Import CSS module

interface RSVPFormData {
  name: string;
  attending: "yes" | "no";
  guests: number;
  message: string;
}

interface RSVPFormProps {
  onBack: () => void;
  onSubmitSuccess: () => void;
}

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
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredGuests, setFilteredGuests] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [hasSelectedFromDropdown, setHasSelectedFromDropdown] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inputValue.trim() === "") {
      setFilteredGuests([]);
    } else {
      const filtered = GUEST_LIST.filter((guest) =>
        guest.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredGuests(filtered);

      if (filtered.length > 0 && !hasSelectedFromDropdown) {
        setShowDropdown(true);
      } else {
        setShowDropdown(false);
      }
    }
  }, [inputValue, hasSelectedFromDropdown]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
      if (
        modalRef.current &&
        showSuccessModal &&
        !modalRef.current.contains(event.target as Node)
      ) {
        handleReturnHome();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSuccessModal]);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setFormData((prev) => ({ ...prev, name: value }));

    if (value !== formData.name) {
      setHasSelectedFromDropdown(false);
    }
  };

  const handleMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 300) {
      setFormData((prev) => ({ ...prev, message: value }));
      setCharCount(value.length);
    }
  };

  const selectGuest = (guestName: string) => {
    setFormData((prev) => ({ ...prev, name: guestName }));
    setInputValue(guestName);
    setShowDropdown(false);
    setHasSelectedFromDropdown(true);
    setFilteredGuests([]);
  };

  const handleNameInputClick = () => {
    if (!hasSelectedFromDropdown && inputValue.trim() === "") {
      setFilteredGuests(GUEST_LIST);
      setShowDropdown(true);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "message") {
      handleMessageChange(e as ChangeEvent<HTMLTextAreaElement>);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "guests" ? parseInt(value) : value,
      }));
    }
  };

  const handleRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value as "yes" | "no",
    }));
  };

  const showModal = (attending: "yes" | "no") => {
    if (attending === "yes") {
      setModalMessage(
        "Thank you for confirming your attendance! We are excited to celebrate with you at our wedding reception!"
      );
    } else {
      setModalMessage(
        "We're sad to hear you can't make it, but we understand. If your plans change, you can always update your RSVP status on our website."
      );
    }
    setShowSuccessModal(true);
  };

  const handleReturnHome = () => {
    setShowSuccessModal(false);
    onSubmitSuccess();
    onBack();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

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
          message: formData.message.trim(),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit RSVP");
      }

      const data = await response.json();
      console.log("RSVP submitted:", data);

      setFormData({
        name: "",
        attending: "yes",
        guests: 1,
        message: "",
      });
      setInputValue("");
      setHasSelectedFromDropdown(false);
      setCharCount(0);

      showModal(formData.attending);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

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
      {showSuccessModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} ref={modalRef}>
            <div className={styles.modalIcon}>
              {formData.attending === "yes" ? "🎉" : "💌"}
            </div>
            <h3 className={styles.modalTitle}>
              {formData.attending === "yes" ? "Thank You!" : "We'll Miss You"}
            </h3>
            <p className={styles.modalMessage}>{modalMessage}</p>
            <button onClick={handleReturnHome} className={styles.modalButton}>
              Return to Invitation
            </button>
          </div>
        </div>
      )}

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
        autoComplete="off"
      >
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
                if (inputValue.trim() === "" && !hasSelectedFromDropdown) {
                  setFilteredGuests(GUEST_LIST);
                  setShowDropdown(true);
                }
              }}
              onKeyDown={handleKeyDown}
              required
              placeholder="Enter or select your name"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              data-lpignore="true"
              data-form-type="other"
              aria-autocomplete="none"
              aria-expanded={showDropdown}
              aria-controls="guest-dropdown"
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
                className={styles.radioInput}
              />
              <span className={styles.radioText}>Yes, I/We will attend</span>
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="attending"
                value="no"
                checked={formData.attending === "no"}
                onChange={handleRadioChange}
                className={styles.radioInput}
              />
              <span className={styles.radioText}>No, I/We cannot attend</span>
            </label>
          </div>
        </div>

        {formData.attending === "yes" && (
          <div className={styles.formGroup}>
            <label htmlFor="guests">Number of Guests (1-8) *</label>
            <select
              id="guests"
              name="guests"
              className={styles.dropdownSelect}
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

        <div className={styles.formGroup}>
          <label htmlFor="message">Comments or Questions (Optional)</label>
          <textarea
            ref={textareaRef}
            id="message"
            name="message"
            value={formData.message}
            onChange={handleMessageChange}
            placeholder="Any comments or questions..."
            rows={4}
            maxLength={300}
            className={styles.textarea}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
          <div className={styles.charCounter}>{charCount}/300 characters</div>
        </div>

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
