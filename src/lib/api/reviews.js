const baseUrl = process.env.NEXT_PUBLIC_AUTH_URL;

export const getPatientReviews = async (patientId) => {
  const res = await fetch(`${baseUrl}/api/reviews/patient/${patientId}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch reviews");
  return res.json();
};

export const addReview = async (reviewData) => {
  const res = await fetch(`${baseUrl}/api/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(reviewData),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to add review");
  }
  return res.json();
};

export const updateReview = async (id, rating, reviewText) => {
  const res = await fetch(`${baseUrl}/api/reviews/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ rating, reviewText }),
  });
  if (!res.ok) throw new Error("Failed to update review");
  return res.json();
};

export const deleteReview = async (id) => {
  const res = await fetch(`${baseUrl}/api/reviews/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete review");
  return res.json();
};