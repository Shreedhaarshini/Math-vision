import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subject, message } = body;

    // Log the received data (simulating storage)
    console.log("[Contact Form Submission]", {
      subject,
      message,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { success: true, message: "Message received successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Contact Form Error]", error);
    return NextResponse.json(
      { success: false, message: "Failed to process message" },
      { status: 500 }
    );
  }
}
