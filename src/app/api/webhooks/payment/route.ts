// Start: Next.js API Route Imports
import { NextRequest, NextResponse } from "next/server";
// End: Next.js API Route Imports

// Start: External Dependencies Imports
import Stripe from "stripe";
import { supabase } from "@/lib/supabase/client";
// End: External Dependencies Imports

// Start: Stripe Initialization
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2026-06-24.dahlia", // Start: Pin to current strict version type
});
// End: Stripe Initialization

// Start: POST Handler for Stripe Webhooks
export async function POST(request: NextRequest) {
  const sig = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  // Start: Stripe Signature Verification Shield
  try {
    if (!sig || !webhookSecret) {
      throw new Error("Stripe signature or webhook secret is missing.");
    }
    
    // Start: Convert Web ReadableStream to Buffer for Native Next.js App Router Ingestion
    const arrayBuffer = await request.arrayBuffer();
    const buf = Buffer.from(arrayBuffer);
    // End: Convert Web ReadableStream to Buffer for Native Next.js App Router Ingestion
    
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err: any) {
    console.error("Webhook Error:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }
  // End: Stripe Signature Verification Shield

  // Start: Event Type Interception and Business Logic
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id;
    
    if (!userId) {
      console.error("Missing user_id in checkout session metadata:", session.id);
      return new NextResponse("Missing user_id in metadata", { status: 400 });
    }

    try {
      // Start: Update Merchant Profile State inside Supabase Engine
      const { error } = await supabase
        .from("profiles")
        .update({ is_premium: true })
        .eq("id", userId);
        
      if (error) {
        console.error("Supabase update error for user_id:", userId, error.message);
        throw new Error(`Supabase update failed: ${error.message}`);
      }
      // End: Update the user's profile in Supabase to mark them as premium
      
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