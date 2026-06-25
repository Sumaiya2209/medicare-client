"use client";

import { useState } from "react";
import {
  Card,
  Form,
  TextField,
  Label,
  Input,
  FieldError,
  Checkbox,
  Button,
} from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient, useSession } from "@/lib/auth-client";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const user = useSession();

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formStatus, setFormStatus] = useState(null);
  // ── Validation ──────────────────────────────────────────────────────────
  const validate = () => {
    const errors = {};

    if (!form.email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!form.password) {
      errors.password = "Password is required.";
    }

    return errors;
  };

  // ── Handlers ────────────────────────────────────────────────────────────
  const handleChange = (field) => (e) => {
    const value = e?.target?.value ?? e;

    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }

    if (formStatus) {
      setFormStatus(null);
    }
  };

  const handleRememberMeChange = (isSelected) => {
    setForm((prev) => ({ ...prev, rememberMe: isSelected }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus(null);
    const errors = validate();

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await authClient.signIn.email({
        email: form.email.trim(),
        password: form.password,
        rememberMe: form.rememberMe,
      });

      if (error) {
        setFormStatus({
          type: "error",
          message: error.message || "Invalid email or password.",
        });
      } else {
        setFormStatus({
          type: "success",
          message: "Signed in! Redirecting...",
        });

        setTimeout(() => {
          if (data?.user?.role === "patient") {
            router.push("/dashboard/patient");
          } else if (data?.user?.role === "doctor") {
            router.push("/dashboard/doctor");
          } else {
            router.push("/dashboard/admin");
          }

          router.refresh();
        }, 1000);
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setFormStatus({
        type: "error",
        message: "Something went wrong. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className=" bg-gradient-to-br from-cyan-50 via-white to-blue-100 flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md shadow-2xl border border-default-200">
        <Card.Header className="items-center text-center pt-8 pb-2">
          <Card.Title className="text-4xl font-bold mb-6">Sign In</Card.Title>
          <Card.Description>Welcome back to MediCare Connect</Card.Description>
        </Card.Header>

        <Form
          className="flex flex-col gap-6 p-8"
          validationBehavior="native"
          onSubmit={handleSubmit}
        >
          <Card.Content className="flex flex-col gap-6 p-0">
            {formStatus && (
              <div
                className={`rounded-xl border px-4 py-3 ${formStatus.type === "success"
                  ? "border-success bg-success/10 text-success"
                  : "border-danger bg-danger/10 text-danger"
                  }`}
              >
                {formStatus.message}
              </div>
            )}

            <TextField
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              isInvalid={!!fieldErrors.email}
            >
              <Label>Email Address</Label>
              <Input placeholder="example@gmail.com" />
              <FieldError>{fieldErrors.email}</FieldError>
            </TextField>

            <TextField
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange("password")}
              isInvalid={!!fieldErrors.password}
            >
              <Label>Password</Label>
              <Input placeholder="Enter password" />
              <FieldError>{fieldErrors.password}</FieldError>
            </TextField>
          </Card.Content>

          <Card.Footer className="p-0 mt-2 flex flex-col gap-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isPending={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>

            <p className="text-center text-sm text-default-500">
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup" className="text-primary underline text-blue-500 hover:text-blue-800">
                Sign up
              </Link>
            </p>
          </Card.Footer>
        </Form>
      </Card>
    </section>
  );
}