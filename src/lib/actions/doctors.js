'use server'

const baseUrl =process.env.NEXT_PUBLIC_AUTH_URL;
export async function getDoctors() {
  const res = await fetch(`${baseUrl}/api/doctors`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.json();
}