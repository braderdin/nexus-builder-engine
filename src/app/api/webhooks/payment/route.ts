import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2026-06-24.dahlia",
});

export async function POST(request: NextRequest) {
  const sig = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) {
      throw new Error("Stripe signature or webhook secret is missing.");
    }
    
    const arrayBuffer = await request.arrayBuffer();
    const buf = Buffer.from(arrayBuffer);
    
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err: any) {
    console.error("Webhook Error:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  } // FIXED: Added missing closing catch block brace

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id;
    
    if (!userId) {
      console.error("Missing user_id in checkout session metadata:", session.id);
      return new NextResponse("Missing user_id in metadata", { status: 400 });
    }

    try {
      const { error } = await supabase
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

  return new NextResponse("Unhandled event type", { status: 200 });
} // FIXED: Added missing closing POST function brace