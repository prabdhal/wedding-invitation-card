// RSVP types
export interface RSVPFormData {
  id?: string;
  name: string;
  attending: "yes" | "no";
  guests: number;
  message: string;
  timestamp?: string;
  updated?: string; // Add this
  ip?: string;
}

export interface RSVPSummary {
  total: number;
  attending: number;
  declined: number;
  totalGuests: number;
}

export interface RSVPResponse {
  success: boolean;
  message: string;
  id?: string;
  updated?: boolean;
  error?: string;
}

export interface RSVPApiResponse {
  rsvps: RSVPFormData[];
  summary: RSVPSummary;
}

export interface RSVPFormProps {
  onBack: () => void;
  onSubmitSuccess: () => void;
}

export interface QRCodeSectionProps {
  onRsvpClick: () => void;
}

export interface WeddingDetailsProps {
  // Add any props if needed
}
