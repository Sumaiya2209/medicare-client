const baseUrl = process.env.NEXT_PUBLIC_AUTH_URL;

export const getFeaturedDoctors = async () => {
  const res = await fetch(`${baseUrl}/api/home/featured-doctors`);
  if (!res.ok) throw new Error("Failed");
  return res.json();
};

export const getPlatformStats = async () => {
  const res = await fetch(`${baseUrl}/api/home/stats`);
  if (!res.ok) throw new Error("Failed");
  return res.json();
};

export const getTestimonials = async () => {
  const res = await fetch(`${baseUrl}/api/home/testimonials`);
  if (!res.ok) throw new Error("Failed");
  return res.json();
};