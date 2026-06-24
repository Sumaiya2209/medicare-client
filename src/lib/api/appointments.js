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