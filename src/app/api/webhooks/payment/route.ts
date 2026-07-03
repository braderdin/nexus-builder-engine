// Start: Next.js API Route Imports
import { NextRequest, NextResponse } from "next/server";
// End: Next.js API Route Imports

// Start: External Dependencies Imports
import Stripe from "stripe";
import { Readable } from "stream";
import { supabase } from "@/lib/supabase/client";
// End: External Dependencies Imports

// Start: Stripe Initialization
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});
// End: Stripe Initialization

// Start: Helper function to convert ReadableStream to Buffer
async function buffer(readable: Readable) {
  const chunks: Buffer[] = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}
// End: Helper function to convert ReadableStream to Buffer

// Start: Configuration for Next.js to parse body as raw
export const config = {
  api: {
    bodyParser: false,
  },
};
// End: Configuration for Next.js to parse body as raw

// Start: POST Handler for Stripe Webhooks
export async function POST(request: NextRequest) {
  // Start: Read raw body for Stripe signature verification
  const buf = await buffer(request.body as unknown as Readable);
  const sig = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  // End: Read raw body for Stripe signature verification

  let event: Stripe.Event;

  // Start: Stripe Signature Verification Shield
  try {
    if (!sig || !webhookSecret) {
      throw new Error("Stripe signature or webhook secret is missing.");
    }
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err: any) {
    console.error("⚠️  Webhook Error:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }
  // End: Stripe Signature Verification Shield

  // Start: Event Type Interception and Business Logic
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Extract user_id from metadata (ensure this is set during session creation)
    const userId = session.metadata?.user_id;

    if (!userId) {
      console.error("Missing user_id in checkout session metadata:", session.id);
      return new NextResponse("Missing user_id in metadata", { status: 400 });
    }

    try {
      // Update the user's profile in Supabase to mark them as premium
      const { data, error } = await supabase
        .from("profiles")
        .update({ is_premium: true })
        .eq("id", userId);

      if (error) {
        console.error("Supabase update error for user_id:", userId, error.message);
        throw new Error(`Supabase update failed: ${error.message}`);
      }

      console.log(`User ${userId} successfully upgraded to premium.`);
      return new NextResponse("OK", { status: 200 });
    } catch (dbError: any) {
      console.error("Database update failed:", dbError.message);
      return new NextResponse(`Database Error: ${dbError.message}`, { status: 500 });
    }
  }
  // End: Event Type Interception and Business Logic

  // Start: Default response for unhandled event types
  return new NextResponse("Unhandled event type", { status: 200 });
  // End: Default response for unhandled event types
}
// End: POST Handler for Stripe Webhooks
