const baseUrl =process.env.NEXT_PUBLIC_AUTH_URL;
console.log("BASE URL =", baseUrl);


export const getAllDoctors = async ({
  search = "",
  specialization = "",
  sort = "fee-asc",
  page = 1,
  limit = 8,
} = {}) => {
  const params = new URLSearchParams({
    search,
    specialization,
    sort,
    page,
    limit,
  });

  const response = await fetch(`${baseUrl}/api/doctors?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch doctors");
  }
  return response.json();
};

export const getDoctorById = async (id) => {
  const response = await fetch(`${baseUrl}/api/doctors/${id}`);
  if (!response.ok) throw new Error("Failed to fetch doctor");
  return response.json();
};

export const getDoctorByUserId = async (userId) => {
  const res = await fetch(
    `${baseUrl}/api/doctors/user/${userId}`,
    { credentials: "include" }
  );
  if (!res.ok) throw new Error("Failed to fetch doctor profile");
  return res.json();
};