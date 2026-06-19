import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URL);

export async function POST(request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.email || !body.password || !body.name) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // First, call the auth signup via the standard endpoint
    const signupResponse = await fetch("http://localhost:3000/api/auth/sign-up/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: body.email,
        password: body.password,
        name: body.name,
      }),
    });

    if (!signupResponse.ok) {
      const error = await signupResponse.json();
      return Response.json(error, { status: signupResponse.status });
    }

    const signupData = await signupResponse.json();
    const userId = signupData.user?.id;

    if (!userId) {
      return Response.json(
        { error: "Signup failed - no user ID" },
        { status: 400 }
      );
    }

    // Now save the custom fields to MongoDB
    const db = client.db(process.env.DATABASE_NAME);

    const customData = {
      role: body.role || "patient",
      image: body.image || "",
    };

    // Add doctor-specific fields if role is doctor
    if (body.role === "doctor") {
      customData.specialization = body.specialization || "";
      customData.qualifications = body.qualifications || "";
      customData.experience = body.experience || "";
      customData.consultationFee = parseFloat(body.consultationFee) || 0;
      customData.hospitalName = body.hospitalName || "";
    }

    // Update user document with custom fields
    await db.collection("user").updateOne(
      { id: userId },
      { $set: customData }
    );

    return Response.json(signupData);
  } catch (error) {
    console.error("Signup error:", error);
    return Response.json(
      { error: "An error occurred during signup" },
      { status: 500 }
    );
  }
}
