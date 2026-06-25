"use client";

import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { confirmPayment } from "@/lib/api/payments";
import { useRouter } from "next/navigation";

export default function CheckoutForm({ appointmentId, amount, doctorName, clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!stripe || !elements) return;

    setLoading(true);
    try {
      const card = elements.getElement(CardElement);

      const { paymentIntent, error: stripeError } = await stripe.confirmCardPayment(
        clientSecret, 
        {
          payment_method: { card },
        }
      );

      if (stripeError) {
        setError(stripeError.message);
        return;
      }

      await confirmPayment(appointmentId, paymentIntent.id);

      setSuccess(true);
      setTimeout(() => router.push("/dashboard/patient"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-10">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-green-600">Payment Successful!</h2>
        <p className="text-gray-500 mt-2">Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gray-50 rounded-xl p-4 border">
        <p className="text-sm text-gray-500">Appointment with</p>
        <p className="font-semibold text-gray-800">{doctorName}</p>
        <p className="text-2xl font-bold text-emerald-700 mt-1">${amount}</p>
      </div>

      <div className="border rounded-xl p-4 bg-white">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#374151",
                "::placeholder": { color: "#9CA3AF" },
              },
            },
          }}
        />
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || !stripe}
        className="w-full bg-emerald-700 text-white rounded-xl py-3 font-semibold disabled:opacity-50"
      >
        {loading ? "Processing..." : `Pay $${amount}`}
      </button>

      <p className="text-xs text-center text-gray-400">
        🔒 Secured by Stripe
      </p>
    </form>
  );
}