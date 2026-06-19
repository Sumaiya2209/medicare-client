// app/api/signup/route.js
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb"; // your singleton connection

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      password,
      role,
      image,
      specialization,
      qualifications,
      experience,
      consultationFee,
      hospitalName,
    } = body;

    // 1. Create the user via Better Auth
    const result = await auth.api.signUpEmail({
      body: { name, email, password, image },
      asResponse: false,
    });

    const userId = result?.user?.id;
    if (!userId) {
      return NextResponse.json(
        { error: "Failed to create account" },
        { status: 400 }
      );
    }

    // 2. Save role + doctor-specific fields in your own collection
    const client = await clientPromise;
    const db = client.db();

    await db.collection("users").updateOne(
      { _id: userId },
      { $set: { role } }
    );

    if (role === "doctor") {
      await db.collection("doctorProfiles").insertOne({
        userId,
        specialization,
        qualifications,
        experience,
        consultationFee: Number(consultationFee),
        hospitalName,
        createdAt: new Date(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { error: err?.message || "Sign up failed" },
      { status: 400 }
    );
  }
}