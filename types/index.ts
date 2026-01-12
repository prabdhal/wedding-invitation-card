// RSVP types
export interface RSVPFormData {
  id?: string;
  name: string;
  email: string;
  phone: string;
  attending: "yes" | "no";
  guests: number;
  dietary: string;
  message: string;
  timestamp?: string;
  ip?: string;
}

export interface RSVPResponse {
  success: boolean;
  message: string;
  id?: string;
  error?: string;
}

export interface RSVPSummary {
  total: number;
  attending: number;
  declined: number;
  totalGuests: number;
}

export interface RSVPApiResponse {
  rsvps: RSVPFormData[];
  summary: RSVPSummary;
}

// Component props
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
