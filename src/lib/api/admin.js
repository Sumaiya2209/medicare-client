const baseUrl = process.env.NEXT_PUBLIC_AUTH_URL;

const adminFetch = (url, options = {}) =>
  fetch(`${baseUrl}${url}`, { credentials: "include", ...options });

// Users
export const getAllUsers = async () => {
  const res = await adminFetch("/api/admin/users");
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};

export const deleteUser = async (id) => {
  const res = await adminFetch(`/api/admin/users/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete user");
  return res.json();
};

export const updateUserStatus = async (id, status) => {
  const res = await adminFetch(`/api/admin/users/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update user status");
  return res.json();
};

// Doctors
export const getAllDoctorsAdmin = async () => {
  const res = await adminFetch("/api/admin/doctors");
  if (!res.ok) throw new Error("Failed to fetch doctors");
  return res.json();
};

export const updateDoctorVerification = async (id, verificationStatus) => {
  const res = await adminFetch(`/api/admin/doctors/${id}/verify`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ verificationStatus }),
  });
  if (!res.ok) throw new Error("Failed to update doctor");
  return res.json();
};

// Analytics
export const getAnalytics = async () => {
  const res = await adminFetch("/api/admin/analytics");
  if (!res.ok) throw new Error("Failed to fetch analytics");
  return res.json();
};

// Appointments
export const getAllAppointmentsAdmin = async () => {
  const res = await adminFetch("/api/admin/appointments");
  if (!res.ok) throw new Error("Failed to fetch appointments");
  return res.json();
};