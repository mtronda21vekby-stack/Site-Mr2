import { NextResponse } from 'next/server';

/**
 * Simple API route to handle contact form submissions. The incoming request
 * payload is expected to be JSON containing a phone and service field. It
 * could be extended to send an email or create a ticket using a third‑party
 * service. For now it just validates input and returns a success JSON.
 */
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { phone, service } = data;
    if (!phone || !service) {
      return NextResponse.json(
        { error: 'Phone and service are required.' },
        { status: 400 }
      );
    }
    // In a real application you might send an email, write to a database or
    // trigger a notification here. We're skipping that for this demo.
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: 'Invalid request body.' },
      { status: 400 }
    );
  }
}