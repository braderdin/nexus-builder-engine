export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

interface CheckoutPayload {
  userId: string;
  userEmail: string;
  priceId: string;
}

export async function POST(request: NextRequest) {
  try {
    const { userId, userEmail, priceId }: CheckoutPayload = await request.json();
    if (!userId || !userEmail || !priceId) {
      return NextResponse.json(
        { error: "Invalid Payload", message: "User ID, email, and price ID are required." },
        { status: 400 }
      );
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      console.error("Missing Stripe secret key in environment.");
      return NextResponse.json(
        { error: "Internal Server Error", message: "Missing Stripe secret key." },
        { status: 500 }
      );
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2026-06-24.dahlia",
    });

    const origin = request.nextUrl.origin;
    const successUrl = `${origin}/dashboard/billing?session_id={CHECKOUT_SESSION_ID}&status=success`;
    const cancelUrl = `${origin}/dashboard/billing?status=cancelled`;

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

    return NextResponse.json({ sessionId: session.id, url: session.url }, { status: 200 });

  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create Stripe Checkout Session.";
    console.error("Stripe Checkout Session Creation Fault:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message },
      { status: 500 }
    );
  }
}
