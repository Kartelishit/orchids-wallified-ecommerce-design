"use client";

import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Loader2, CreditCard, Truck, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const COD_FEE = 50;
const MIN_CART_VALUE = 200;

interface AddressForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

function PaymentForm({
  clientSecret,
  onSuccess,
  isProcessing,
  setIsProcessing,
}: {
  clientSecret: string;
  onSuccess: (paymentIntentId: string) => void;
  isProcessing: boolean;
  setIsProcessing: (v: boolean) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !isReady) return;

    setIsProcessing(true);
    setError(null);

    const { error: submitError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-confirmation`,
      },
      redirect: "if_required",
    });

    if (submitError) {
      setError(submitError.message || "Payment failed");
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      onSuccess(paymentIntent.id);
    } else {
      setError("Payment was not completed. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white border border-zinc-100 p-6 max-h-[400px] overflow-y-auto">
        <PaymentElement
          onReady={() => setIsReady(true)}
          options={{
            layout: "accordion",
          }}
        />
      </div>
      {error && (
        <div className="bg-red-50 border-l-4 border-[#FF0000] p-4 text-[#FF0000] text-sm font-bold">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={!stripe || !elements || isProcessing || !isReady}
        className="hidden md:flex w-full items-center justify-center gap-3 bg-[#FF0000] text-white py-5 font-black uppercase tracking-widest text-xs disabled:bg-zinc-200 disabled:text-zinc-400 transition-all hover:bg-black"
      >
        {isProcessing ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Processing...
          </>
        ) : (
          <>
            <CreditCard size={16} /> Pay Now
          </>
        )}
      </button>
    </form>
  );
}

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<"prepaid" | "cod">("prepaid");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"address" | "payment">("address");

  const [address, setAddress] = useState<AddressForm>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const shippingFee = paymentMethod === "prepaid" ? 0 : 0;
  const codFee = paymentMethod === "cod" ? COD_FEE : 0;
  const total = cartTotal + shippingFee + codFee;

  useEffect(() => {
    if (cartTotal < MIN_CART_VALUE && cart.length > 0) {
      router.push("/cart");
    }
  }, [cartTotal, cart.length, router]);

  const validateAddress = () => {
    if (!address.name.trim()) return "Name is required";
    if (!address.email.trim() || !address.email.includes("@")) return "Valid email is required";
    if (!address.phone.trim() || address.phone.length < 10) return "Valid phone number is required";
    if (!address.address.trim()) return "Address is required";
    if (!address.city.trim()) return "City is required";
    if (!address.state.trim()) return "State is required";
    if (!address.pincode.trim() || address.pincode.length !== 6) return "Valid 6-digit pincode is required";
    return null;
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateAddress();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);

    if (paymentMethod === "prepaid") {
      setIsLoading(true);
      try {
        const res = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: total,
            metadata: {
              customerName: address.name,
              customerEmail: address.email,
            },
          }),
        });
        const data = await res.json();
        if (data.error) {
          setError(data.error);
          setIsLoading(false);
          return;
        }
        setClientSecret(data.clientSecret);
        setStep("payment");
      } catch {
        setError("Failed to initialize payment");
      }
      setIsLoading(false);
    } else {
      handleCODOrder();
    }
  };

  const handleCODOrder = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMethod: "cod",
          customerName: address.name,
          customerEmail: address.email,
          customerPhone: address.phone,
          shippingAddress: address.address,
          shippingCity: address.city,
          shippingState: address.state,
          shippingPincode: address.pincode,
          subtotal: cartTotal,
          shippingFee,
          codFee,
          total,
          items: cart.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            size: item.size,
            image_url: item.image_url,
          })),
        }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setIsProcessing(false);
        return;
      }
      clearCart();
      router.push(`/order-confirmation?orderId=${data.order.id}&method=cod`);
    } catch {
      setError("Failed to place order");
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async (paymentId: string) => {
    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentIntentId: paymentId,
          paymentMethod: "prepaid",
          customerName: address.name,
          customerEmail: address.email,
          customerPhone: address.phone,
          shippingAddress: address.address,
          shippingCity: address.city,
          shippingState: address.state,
          shippingPincode: address.pincode,
          subtotal: cartTotal,
          shippingFee,
          codFee: 0,
          total,
          items: cart.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            size: item.size,
            image_url: item.image_url,
          })),
        }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setIsProcessing(false);
        return;
      }
      clearCart();
      router.push(`/order-confirmation?orderId=${data.order.id}&method=prepaid`);
    } catch {
      setError("Failed to place order");
      setIsProcessing(false);
    }
  };

  const stripeOptions: StripeElementsOptions = {
    clientSecret: clientSecret || undefined,
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "#FF0000",
        colorBackground: "#ffffff",
        colorText: "#000000",
        fontFamily: "system-ui, sans-serif",
        borderRadius: "0px",
      },
    },
  };

  if (cart.length === 0) {
    return (
      <div className="py-40 bg-white min-h-screen">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400 text-xl font-bold uppercase tracking-widest mb-10">
            Your cart is empty
          </p>
          <Link
            href="/shop"
            className="inline-block bg-[#FF0000] text-white px-10 py-5 font-black uppercase tracking-widest hover:bg-black transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 md:py-20 bg-white min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-8 md:mb-16">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-black transition-colors mb-6 text-sm font-bold uppercase tracking-widest"
          >
            <ArrowLeft size={16} /> Back to Cart
          </Link>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl md:text-7xl font-black text-black tracking-tighter uppercase mb-4"
          >
            Checkout
          </motion.h1>
          <div className="h-1 w-24 bg-[#FF0000]" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
          <div className="lg:col-span-2 space-y-8">
            <AnimatePresence mode="wait">
              {step === "address" ? (
                <motion.div
                  key="address"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="bg-zinc-50 p-6 md:p-10">
                    <h2 className="text-sm font-black uppercase tracking-widest mb-8 pb-4 border-b border-zinc-200">
                      Shipping Details
                    </h2>
                    <form onSubmit={handleAddressSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            value={address.name}
                            onChange={(e) => setAddress({ ...address, name: e.target.value })}
                            className="w-full px-4 py-4 border border-zinc-200 focus:border-[#FF0000] outline-none text-sm font-bold"
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">
                            Email *
                          </label>
                          <input
                            type="email"
                            value={address.email}
                            onChange={(e) => setAddress({ ...address, email: e.target.value })}
                            className="w-full px-4 py-4 border border-zinc-200 focus:border-[#FF0000] outline-none text-sm font-bold"
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={address.phone}
                          onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                          className="w-full px-4 py-4 border border-zinc-200 focus:border-[#FF0000] outline-none text-sm font-bold"
                          placeholder="9876543210"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">
                          Street Address *
                        </label>
                        <textarea
                          value={address.address}
                          onChange={(e) => setAddress({ ...address, address: e.target.value })}
                          rows={2}
                          className="w-full px-4 py-4 border border-zinc-200 focus:border-[#FF0000] outline-none text-sm font-bold resize-none"
                          placeholder="123, Example Street, Landmark"
                        />
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">
                            City *
                          </label>
                          <input
                            type="text"
                            value={address.city}
                            onChange={(e) => setAddress({ ...address, city: e.target.value })}
                            className="w-full px-4 py-4 border border-zinc-200 focus:border-[#FF0000] outline-none text-sm font-bold"
                            placeholder="Mumbai"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">
                            State *
                          </label>
                          <input
                            type="text"
                            value={address.state}
                            onChange={(e) => setAddress({ ...address, state: e.target.value })}
                            className="w-full px-4 py-4 border border-zinc-200 focus:border-[#FF0000] outline-none text-sm font-bold"
                            placeholder="Maharashtra"
                          />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                          <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">
                            Pincode *
                          </label>
                          <input
                            type="text"
                            value={address.pincode}
                            onChange={(e) => setAddress({ ...address, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })}
                            className="w-full px-4 py-4 border border-zinc-200 focus:border-[#FF0000] outline-none text-sm font-bold"
                            placeholder="400001"
                          />
                        </div>
                      </div>

                      <div className="pt-6 border-t border-zinc-200">
                        <h3 className="text-sm font-black uppercase tracking-widest mb-6">
                          Payment Method
                        </h3>
                        <div className="space-y-4">
                          <label
                            className={`flex items-center gap-4 p-5 border-2 cursor-pointer transition-all ${
                              paymentMethod === "prepaid"
                                ? "border-[#FF0000] bg-red-50"
                                : "border-zinc-200 hover:border-zinc-300"
                            }`}
                          >
                            <input
                              type="radio"
                              name="payment"
                              checked={paymentMethod === "prepaid"}
                              onChange={() => setPaymentMethod("prepaid")}
                              className="accent-[#FF0000] w-4 h-4"
                            />
                            <div className="flex-grow">
                              <span className="font-black text-sm uppercase">Prepaid (Cards/UPI)</span>
                              <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest mt-1">
                                FREE Shipping
                              </p>
                            </div>
                            <CreditCard size={20} className="text-zinc-400" />
                          </label>
                          <label
                            className={`flex items-center gap-4 p-5 border-2 cursor-pointer transition-all ${
                              paymentMethod === "cod"
                                ? "border-[#FF0000] bg-red-50"
                                : "border-zinc-200 hover:border-zinc-300"
                            }`}
                          >
                            <input
                              type="radio"
                              name="payment"
                              checked={paymentMethod === "cod"}
                              onChange={() => setPaymentMethod("cod")}
                              className="accent-[#FF0000] w-4 h-4"
                            />
                            <div className="flex-grow">
                              <span className="font-black text-sm uppercase">Cash on Delivery</span>
                              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
                                +₹{COD_FEE} COD Fee
                              </p>
                            </div>
                            <Truck size={20} className="text-zinc-400" />
                          </label>
                        </div>
                      </div>

                      {error && (
                        <div className="bg-red-50 border-l-4 border-[#FF0000] p-4 text-[#FF0000] text-sm font-bold">
                          {error}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isLoading || isProcessing}
                        className="hidden md:flex w-full items-center justify-center gap-3 bg-[#FF0000] text-white py-5 font-black uppercase tracking-widest text-xs disabled:bg-zinc-200 disabled:text-zinc-400 transition-all hover:bg-black"
                      >
                        {isLoading || isProcessing ? (
                          <>
                            <Loader2 size={16} className="animate-spin" /> Processing...
                          </>
                        ) : paymentMethod === "prepaid" ? (
                          "Continue to Payment"
                        ) : (
                          "Place Order (COD)"
                        )}
                      </button>
                    </form>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="bg-zinc-50 p-6 md:p-10">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-200">
                      <h2 className="text-sm font-black uppercase tracking-widest">
                        Payment
                      </h2>
                      <button
                        onClick={() => {
                          setStep("address");
                          setClientSecret(null);
                        }}
                        className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-black transition-colors"
                      >
                        Edit Address
                      </button>
                    </div>

                    <div className="mb-6 p-4 bg-white border border-zinc-100">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">
                        Shipping to:
                      </p>
                      <p className="font-bold text-sm">{address.name}</p>
                      <p className="text-xs text-zinc-500">
                        {address.address}, {address.city}, {address.state} - {address.pincode}
                      </p>
                      <p className="text-xs text-zinc-500">{address.phone}</p>
                    </div>

                    {clientSecret && (
                      <Elements stripe={stripePromise} options={stripeOptions}>
                        <PaymentForm
                          clientSecret={clientSecret}
                          onSuccess={handlePaymentSuccess}
                          isProcessing={isProcessing}
                          setIsProcessing={setIsProcessing}
                        />
                      </Elements>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-zinc-50 p-6 md:p-10 lg:sticky lg:top-40">
              <h4 className="text-sm font-black uppercase tracking-widest mb-8 border-b border-zinc-200 pb-4">
                Order Summary
              </h4>

              <div className="space-y-4 mb-6 max-h-[200px] overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="relative w-16 h-20 flex-shrink-0 bg-white">
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                      <div className="flex-grow min-w-0">
                        <p className="text-xs font-black uppercase truncate">{item.name}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-[10px] text-zinc-400 font-bold">
                            {item.size || "A4"} × {item.quantity}
                          </p>
                          {item.is_borderless && (
                            <span className="text-[8px] font-black text-red-500 uppercase tracking-widest bg-red-50 px-1">Borderless</span>
                          )}
                        </div>
                      </div>
                    <p className="text-xs font-black">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6 pt-4 border-t border-zinc-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 uppercase font-bold tracking-tight">Subtotal</span>
                  <span className="font-black text-black">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 uppercase font-bold tracking-tight">Shipping</span>
                  <span className="font-black text-green-600">FREE</span>
                </div>
                {paymentMethod === "cod" && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 uppercase font-bold tracking-tight">COD Fee</span>
                    <span className="font-black text-black">₹{COD_FEE}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between text-xl font-black border-t border-zinc-200 pt-6 mb-8">
                <span className="uppercase tracking-tighter text-black">Total</span>
                <span className="text-[#FF0000]">₹{total}</span>
              </div>

              <div className="flex flex-col gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <p className="flex items-center gap-2">
                  <ShieldCheck size={14} /> Secure Payment
                </p>
                <p className="flex items-center gap-2">
                  <Truck size={14} /> Fast Delivery
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 p-4 md:hidden z-50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-black uppercase">Total</span>
            <span className="text-xl font-black text-[#FF0000]">₹{total}</span>
          </div>
          {step === "address" ? (
            <button
              onClick={handleAddressSubmit}
              disabled={isLoading || isProcessing}
              className="w-full flex items-center justify-center gap-3 bg-[#FF0000] text-white py-4 font-black uppercase tracking-widest text-xs disabled:bg-zinc-200 disabled:text-zinc-400"
            >
              {isLoading || isProcessing ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Processing...
                </>
              ) : paymentMethod === "prepaid" ? (
                "Continue to Payment"
              ) : (
                "Place Order (COD)"
              )}
            </button>
          ) : (
            <button
              form="payment-form"
              type="submit"
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-3 bg-[#FF0000] text-white py-4 font-black uppercase tracking-widest text-xs disabled:bg-zinc-200 disabled:text-zinc-400"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <CreditCard size={16} /> Pay Now
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
