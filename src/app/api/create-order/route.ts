import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      paymentIntentId,
      paymentMethod,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      shippingCity,
      shippingState,
      shippingPincode,
      subtotal,
      shippingFee,
      codFee,
      total,
      items,
    } = body;

    if (!customerName || !customerEmail || !customerPhone) {
      return NextResponse.json(
        { error: "Customer details required" },
        { status: 400 }
      );
    }

    if (!shippingAddress || !shippingCity || !shippingState || !shippingPincode) {
      return NextResponse.json(
        { error: "Shipping address required" },
        { status: 400 }
      );
    }

    if (subtotal < 200) {
      return NextResponse.json(
        { error: "Minimum order value is ₹200" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("orders")
      .insert({
        stripe_payment_intent_id: paymentIntentId || null,
        status: paymentMethod === "cod" ? "pending" : "paid",
        payment_method: paymentMethod,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        shipping_address: shippingAddress,
        shipping_city: shippingCity,
        shipping_state: shippingState,
        shipping_pincode: shippingPincode,
        subtotal,
        shipping_fee: shippingFee,
        cod_fee: codFee,
        total,
        items,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating order:", error);
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      );
    }

    return NextResponse.json({ order: data });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
