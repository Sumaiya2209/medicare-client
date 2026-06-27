const baseUrl = process.env.NEXT_PUBLIC_AUTH_URL;

export const getDoctorPrescriptions = async (doctorId) => {
  const res = await fetch(`${baseUrl}/api/prescriptions/doctor/${doctorId}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch prescriptions");
  return res.json();
};

export const createPrescription = async (data) => {
  const res = await fetch(`${baseUrl}/api/prescriptions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create prescription");
  return res.json();
};

export const updatePrescription = async (id, data) => {
  const res = await fetch(`${baseUrl}/api/prescriptions/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update prescription");
  return res.json();
};

export const getPrescriptionByAppointment = async (appointmentId) => {
  const res = await fetch(
    `${baseUrl}/api/prescriptions/appointment/${appointmentId}`,
    { credentials: "include" }
  );
  if (!res.ok) throw new Error("Failed to fetch prescription");
  return res.json();
};