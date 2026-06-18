"use client";

import { useState } from "react";
import {
  Form,
  Input,
  Button,
  Checkbox,
} from "@heroui/react";
import Link from "next/link";

export default function RegisterPage() {
  const [role, setRole] = useState("patient");
  const [isSubmitted, setIsSubmitted] = useState(false);


  const passwordValidation = (value) => {
    if (!value) return "Password is required";

    const regex =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{6,}$/;

    if (!regex.test(value)) {
      return "Password must be at least 6 characters and include a number and special character";
    }

    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = Object.fromEntries(
      new FormData(e.currentTarget)
    );

    const doctorData =
      role === "doctor"
        ? {
          specialization: formData.specialization,
          qualifications: formData.qualifications,
          experience: formData.experience,
          consultationFee: Number(formData.consultationFee),
          hospitalName: formData.hospitalName,
          availableDays: [],
          availableSlots: [],
          verificationStatus: false,
        }
        : {};

    const userData = {
      name: formData.name,
      email: formData.email,
      photoURL: formData.photoURL,
      role,
      ...doctorData,
    };

    console.log(userData);

    // Better Auth Sign Up Here

    setIsSubmitted(true);
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl shadow-2xl border border-default-200">
        <div className="flex flex-col gap-2 py-8">
          <h1 className="text-4xl font-bold text-center">
            Sign Up
          </h1>

          <p className="text-center text-default-500">
            Create your account
          </p>
        </div>


        <div className="p-8">
          {isSubmitted && (
            <div className="mb-6 rounded-xl border border-success bg-success/10 px-4 py-3 text-success">
              Registration completed successfully 🎉
            </div>
          )}

          <Form
            className="flex flex-col gap-6"
            validationBehavior="native"
            onSubmit={handleSubmit}
          >
            {/* Basic Information */}
            <div className="grid gap-5 w-full">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">
                  Full Name
                </label>

                <Input
                  isRequired
                  name="name"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">
                  Email Address
                </label>

                <Input
                  isRequired
                  type="email"
                  name="email"
                  placeholder="example@gmail.com"
                />
              </div>
            </div>

             {/* Photo */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">
                  Photo URL
                </label>

                <Input
                  name="photoURL"
                  placeholder="https://example.com/photo.jpg"
                />
              </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-sm font-medium">
                Password
              </label>

              <Input
                isRequired
                type="password"
                name="password"
                placeholder="Enter password"
                validate={passwordValidation}
                description="Minimum 6 characters, one number and one special character"
              />
            </div>


            {/* Role Selection */}
            <div className="w-full flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">
                Select Role
              </label>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="patient"
                    checked={role === "patient"}
                    onChange={(e) => setRole(e.target.value)}
                    className="radio radio-primary"
                  />

                  <span>Patient</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="doctor"
                    checked={role === "doctor"}
                    onChange={(e) => setRole(e.target.value)}
                    className="radio radio-primary"
                  />

                  <span>Doctor</span>
                </label>
              </div>
            </div>

            {/* Doctor Fields */}
            {role === "doctor" && (
              <div className="w-full rounded-2xl border border-default-200 p-6">
                <h2 className="font-bold text-xl mb-5">
                  Professional Information
                </h2>

                <div className="grid md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">
                      Specialization
                    </label>

                    <Input
                      isRequired
                      name="specialization"
                      placeholder="Cardiology"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">
                      Qualifications
                    </label>

                    <Input
                      isRequired
                      name="qualifications"
                      placeholder="MBBS, FCPS"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">
                      Experience
                    </label>

                    <Input
                      isRequired
                      name="experience"
                      placeholder="5 Years"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">
                      Consultation Fee
                    </label>

                    <Input
                      isRequired
                      type="number"
                      name="consultationFee"
                      placeholder="500"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-sm font-medium">
                      Hospital Name
                    </label>

                    <Input
                      isRequired
                      name="hospitalName"
                      placeholder="United Hospital"
                    />
                  </div>
                </div>
              </div>
            )}

            <Checkbox isRequired name="terms">
              I agree to the Terms & Conditions
            </Checkbox>

            <Button
              type="submit"
              color="primary"
              size="lg"
              className="w-full"
            >
              Create Account
            </Button>
          </Form>
        </div>
      </div>
    </section>
  );
}