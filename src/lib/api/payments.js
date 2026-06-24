const baseUrl = process.env.NEXT_PUBLIC_AUTH_URL;

export const createPaymentIntent = async (appointmentId, amount) => {
  const res = await fetch(`${baseUrl}/api/payments/create-intent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ appointmentId, amount }),
  });
  if (!res.ok) {
    throw new Error("Failed to create payment intent");
  }
  return res.json();
};

export const confirmPayment = async (appointmentId, transactionId) => {
  const res = await fetch(`${baseUrl}/api/appointments/${appointmentId}/payment`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ transactionId }),
  });
  if (!res.ok) {
    throw new Error("Failed to confirm payment");
  }
  return res.json();
};

export const getPatientPayments = async (patientId) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_AUTH_URL}/api/payments/patient/${patientId}`,
    { credentials: "include" }
  );
  if (!res.ok) throw new Error("Failed to fetch payment history");
  return res.json();
};