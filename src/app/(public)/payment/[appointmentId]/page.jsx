"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { createPaymentIntent } from "@/lib/api/payments";
import CheckoutForm from "@/components/payment/CheckoutForm";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function PaymentPage() {
  const { appointmentId } = useParams();
  const [clientSecret, setClientSecret] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const baseUrl = process.env.NEXT_PUBLIC_AUTH_URL;

  useEffect(() => {
    const fetchAndCreateIntent = async () => {
      try {
        // Appointment info fetch koro
        const apptRes = await fetch(`${baseUrl}/api/appointments/${appointmentId}`, {
          credentials: "include",
        });
        const appt = await apptRes.json();
        setAppointment(appt);

        // Payment intent create koro
        const { clientSecret } = await createPaymentIntent(
          appointmentId,
          appt.doctorInfo?.consultationFee || appt.amount
        );
        setClientSecret(clientSecret);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (appointmentId) fetchAndCreateIntent();
  }, [appointmentId]);

  if (loading) return <p className="text-center py-20 text-gray-500">Loading payment...</p>;
  if (error) return <p className="text-center py-20 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Complete Payment</h1>

        {clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm
              appointmentId={appointmentId}
              amount={appointment?.doctorInfo?.consultationFee || 0}
              doctorName={appointment?.doctorInfo?.doctorName || "Doctor"}
              clientSecret={clientSecret}
            />
          </Elements>
        )}
      </div>
    </div>
  );
}