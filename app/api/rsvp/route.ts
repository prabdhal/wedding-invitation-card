import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface RSVPFormData {
  id?: string;
  name: string;
  attending: "yes" | "no";
  guests: number;
  timestamp?: string;
  ip?: string;
}

const DATA_FILE = path.join(process.cwd(), "data", "rsvps.json");
const dataDir = path.join(process.cwd(), "data");

// Initialize data directory and file
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

export async function GET() {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf8");
    const rsvps: RSVPFormData[] = JSON.parse(data);

    const attending = rsvps.filter((r) => r.attending === "yes");
    const totalGuests = attending.reduce(
      (sum, rsvp) => sum + (rsvp.guests || 0),
      0
    );

    const summary = {
      total: rsvps.length,
      attending: attending.length,
      declined: rsvps.length - attending.length,
      totalGuests,
    };

    return NextResponse.json({ rsvps, summary });
  } catch (error) {
    console.error("Error fetching RSVPs:", error);
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

    const timestamp = new Date().toISOString();
    const ip = request.headers.get("x-forwarded-for") || "unknown";

    // Read existing data
    const existingData = fs.readFileSync(DATA_FILE, "utf8");
    const rsvps: RSVPFormData[] = JSON.parse(existingData);

    // Add new RSVP with ID
    const newRsvp: RSVPFormData = {
      id: Date.now().toString(),
      ...body,
      timestamp,
      ip,
    };

    rsvps.push(newRsvp);

    // Save to file
    fs.writeFileSync(DATA_FILE, JSON.stringify(rsvps, null, 2));

    return NextResponse.json({
      success: true,
      message: "RSVP saved successfully",
      id: newRsvp.id,
    });
  } catch (error) {
    console.error("Error saving RSVP:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save RSVP" },
      { status: 500 }
    );
  }
}
