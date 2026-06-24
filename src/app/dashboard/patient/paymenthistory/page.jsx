"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { getPatientPayments } from "@/lib/api/payments";

function PaymentHistoryCard({ payment }) {
  const { doctorInfo, appointmentDate, appointmentTime, transactionId, paidAt } =
    payment;

  const amount = doctorInfo?.consultationFee || 0;

  const formattedDate = paidAt
    ? new Date(paidAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : appointmentDate;

  return (
    <div className="flex items-center justify-between rounded-2xl border bg-white px-5 py-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Left: Doctor info */}
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold text-lg">
          {doctorInfo?.doctorName?.charAt(0) || "D"}
        </div>

        <div>
          <h3 className="font-semibold text-gray-800">
            {doctorInfo?.doctorName || "Doctor"}
          </h3>
          <p className="text-sm text-gray-500">
            {doctorInfo?.specialization || "N/A"} ·{" "}
            {doctorInfo?.hospitalName || "N/A"}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            Appointment: {appointmentDate} at {appointmentTime}
          </p>
        </div>
      </div>

      {/* Right: Amount + status */}
      <div className="text-right shrink-0">
        <p className="text-xl font-bold text-emerald-700">${amount}</p>

        <span className="mt-1 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
          ✓ Paid
        </span>

        <p className="text-xs text-gray-400 mt-1">{formattedDate}</p>

        {transactionId && (
          <p className="text-xs text-gray-400 mt-0.5 font-mono">
            #{transactionId.slice(0, 16)}...
          </p>
        )}
      </div>
    </div>
  );
}

export default function PaymentHistoryPage() {
  const { data: session } = authClient.useSession();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!session?.user?.id) return;

    getPatientPayments(session.user.id)
      .then((data) => setPayments(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [session?.user?.id]);

  const totalPaid = payments.reduce(
    (sum, p) => sum + (p.doctorInfo?.consultationFee || 0),
    0
  );

  if (loading)
    return (
      <p className="text-center py-20 text-gray-500">
        Loading payment history...
      </p>
    );

  if (error)
    return (
      <p className="text-center py-20 text-red-500">Error: {error}</p>
    );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment History</h1>
      <p className="text-gray-500 mb-6">All your completed payments</p>

      {/* Summary card */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <div className="rounded-2xl border bg-white p-4 shadow-sm text-center">
          <p className="text-sm text-gray-500">Total Transactions</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">
            {payments.length}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-4 shadow-sm text-center">
          <p className="text-sm text-gray-500">Total Paid</p>
          <p className="text-2xl font-bold text-emerald-700 mt-1">
            ${totalPaid}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-4 shadow-sm text-center col-span-2 sm:col-span-1">
          <p className="text-sm text-gray-500">Last Payment</p>
          <p className="text-lg font-bold text-gray-800 mt-1">
            {payments[0]
              ? new Date(payments[0].paidAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "N/A"}
          </p>
        </div>
      </div>

      {/* Payment list */}
      {payments.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-4">💳</p>
          <p className="text-lg font-medium">No payments yet</p>
          <p className="text-sm mt-1">
            Your payment history will appear here after booking
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {payments.map((payment) => (
            <PaymentHistoryCard key={payment._id} payment={payment} />
          ))}
        </div>
      )}
    </div>
  );
}