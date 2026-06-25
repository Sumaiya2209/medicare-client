const baseUrl = process.env.NEXT_PUBLIC_AUTH_URL;

export const bookAppointment = async (appointmentData) => {
  const response = await fetch(`${baseUrl}/api/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(appointmentData),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to book appointment");
  }

  return response.json();
};


export const getPatientAppointments = async (patientId) => {
  const response = await fetch(
    `${baseUrl}/api/appointments/patient/${patientId}`
    , {
      credentials: "include",
    }
  );

  console.log("Status:", response.status);

  const data = await response.json();
  console.log("Response:", data);

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch appointments");
  }

  return data;
};

export const getDoctorAppointments = async (doctorId) => {
  const res = await fetch(
    `${baseUrl}/api/appointments/doctor/${doctorId}`,
    { credentials: "include" }
  );
  if (!res.ok) throw new Error("Failed to fetch doctor appointments");
  return res.json();
};

export const updateAppointmentStatus = async (appointmentId, status) => {
  const res = await fetch(
    `${baseUrl}/api/appointments/${appointmentId}/status`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status }),
    }
  );
  if (!res.ok) throw new Error("Failed to update appointment status");
  return res.json();
};

export const cancelAppointment = async (appointmentId) => {
  const res = await fetch(
    `${baseUrl}/api/appointments/${appointmentId}/cancel`,
    {
      method: "PATCH",
      credentials: "include",
    }
  );
  if (!res.ok) throw new Error("Failed to cancel appointment");
  return res.json();
};

export const rescheduleAppointment = async (appointmentId, appointmentDate, appointmentTime) => {
  const res = await fetch(
    `${baseUrl}/api/appointments/${appointmentId}/reschedule`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ appointmentDate, appointmentTime }),
    }
  );
  if (!res.ok) throw new Error("Failed to reschedule appointment");
  return res.json();
};