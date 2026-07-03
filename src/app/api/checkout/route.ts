import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Start: Stripe API Initialization (Ensure STRIPE_SECRET_KEY is set in your .env.local)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-06-24.dahlia", // Start: Pin to current strict version type
});
// End: Stripe API Initialization

// Start: Request Payload Type Definition
interface CheckoutPayload {
  userId: string;
  userEmail: string;
  priceId: string;
}
// End: Request Payload Type Definition

// Start: POST Gateway Node for Stripe Checkout Session Configuration
export async function POST(request: NextRequest) {
  try {
    // Start: Dynamic Payload Context Extraction and Validation
    const { userId, userEmail, priceId }: CheckoutPayload = await request.json();
    if (
      !userId || typeof userId !== "string" ||
      !userEmail || typeof userEmail !== "string" ||
      !priceId || typeof priceId !== "string"
    ) {
      return NextResponse.json(
        { error: "Invalid Payload", message: "User ID, email, and price ID are required." },
        { status: 400 }
      );
    }
    // End: Dynamic Payload Context Extraction and Validation

    // Start: Construct Dynamic Redirect URLs for Checkout Session
    const origin = request.nextUrl.origin;
    const successUrl = `${origin}/dashboard/billing?session_id={CHECKOUT_SESSION_ID}&status=success`;
    const cancelUrl = `${origin}/dashboard/billing?status=cancelled`;
    // End: Construct Dynamic Redirect URLs for Checkout Session

    // Start: Create Secure Stripe Checkout Session Payload
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: userEmail,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        user_id: userId,
        priceId: priceId,
      },
    });
    // End: Create Secure Stripe Checkout Session Payload

    // Start: Return Stripe Checkout Session URL for Client-side Redirection
    return NextResponse.json({ sessionId: session.id, url: session.url }, { status: 200 });
    // End: Return Stripe Checkout Session URL for Client-side Redirection
  } catch (error: any) {
    // Start: Defensive Error Catching Block
    console.error("Stripe Checkout Session Creation Fault:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message || "Failed to create Stripe Checkout Session." },
      { status: 500 }
    );
    // End: Defensive Error Catching Block
  }
}
// End: POST Gateway Node for Stripe Checkout Session Configuration