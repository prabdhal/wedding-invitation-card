// app/api/rsvp/route.ts
import { NextRequest, NextResponse } from "next/server";

interface RSVPFormData {
  id?: string;
  name: string;
  attending: "yes" | "no";
  guests: number;
  message: string;
  timestamp?: string;
  updated?: string;
  ip?: string;
}

// TEMPORARY - just to test
const GOOGLE_SHEETS_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

export async function GET() {
  try {
    return NextResponse.json({
      message: "RSVPs are stored in Google Sheets",
      note: "Access your Google Sheet to view all RSVPs",
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch RSVPs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: RSVPFormData = await request.json();

    // Validate required fields
    if (!body.name || !body.attending) {
      return NextResponse.json(
        {
          success: false,
          error: "Name and attendance status are required",
        },
        { status: 400 }
      );
    }

    // Check if webhook URL is configured
    if (!GOOGLE_SHEETS_URL) {
      console.error("❌ GOOGLE_SHEETS_WEBHOOK_URL not configured!");
      return NextResponse.json(
        {
          success: false,
          error: "Server configuration error. Please contact support.",
        },
        { status: 500 }
      );
    }

    const timestamp = new Date().toISOString();
    const ip = request.headers.get("x-forwarded-for") || "unknown";

    const rsvpData = {
      name: body.name.trim(),
      attending: body.attending,
      guests: body.attending === "yes" ? body.guests || 1 : 0,
      message: body.message?.trim() || "",
      timestamp: timestamp,
      ip: ip,
    };

    // Send to Google Sheets
    const response = await fetch(GOOGLE_SHEETS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rsvpData),
    });

    if (!response.ok) {
      console.error("❌ Google Sheets webhook failed:", response.status);
      throw new Error("Failed to save to Google Sheets");
    }

    // Try to parse the response to check if it was an update
    let wasUpdated = false;
    try {
      const responseData = await response.text();
      const parsed = JSON.parse(responseData);

      wasUpdated = parsed.updated === true;
    } catch (e) {
      console.log("Could not parse response, assuming success");
    }

    return NextResponse.json({
      success: true,
      message: wasUpdated
        ? "RSVP updated successfully"
        : "RSVP saved successfully",
      id: Date.now().toString(),
      updated: wasUpdated,
    });
  } catch (error) {
    console.error("❌ Error saving RSVP:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save RSVP" },
      { status: 500 }
    );
  }
}
