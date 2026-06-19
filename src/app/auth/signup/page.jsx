"use client";

import { useState } from "react";
import {
  Card,
  Form,
  TextField,
  Label,
  Input,
  FieldError,
  RadioGroup,
  Radio,
  Checkbox,
  Button,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    image: "",
    role: "patient",
    password: "",
    specialization: "",
    qualifications: "",
    experience: "",
    consultationFee: "",
    hospitalName: "",
  });

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formStatus, setFormStatus] = useState(null);

  // ── Validation ──────────────────────────────────────────────────────────
  const validate = () => {
    const errors = {};

    if (!form.name.trim()) {
      errors.name = "Name is required.";
    } else if (form.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters.";
    }

    if (!form.email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!form.password) {
      errors.password = "Password is required.";
    } else if (form.password.length < 8) {
      errors.password = "Password must be at least 8 characters.";
    }

    if (!form.role) {
      errors.role = "Please select a role";
    }

    return errors;
  };

  // ── Handlers ────────────────────────────────────────────────────────────
  // v3 Input's onChange gives a plain string value (not an event), so this
  // works for TextField inputs. Role still goes through the same setter.
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
      const { data, error } = await authClient.signUp.email({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
        image: form.image,
        ...(form.role === "doctor" && {
          specialization: form.specialization,
          qualifications: form.qualifications,
          experience: form.experience,
          consultationFee: form.consultationFee,
          hospitalName: form.hospitalName,
        }),
      })
      console.log(data)

      if (error) {
        setFormStatus({
          type: "error",
          message: error.message || "Sign up failed. Please try again.",
        });
      } else {
        setFormStatus({
          type: "success",
          message: "Account created! Redirecting...",
        });

        setTimeout(() => {
          router.push("/");
        }, 1500);
      }
    } catch (error) {
      console.error("Signup error:", error);
      setFormStatus({
        type: "error",
        message: "Something went wrong. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-100 flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-2xl shadow-2xl border border-default-200">
        <Card.Header className="items-center text-center pt-8 pb-2">
          <Card.Title className="text-4xl font-bold">Sign Up</Card.Title>
          <Card.Description>Create your account</Card.Description>
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

            {/* Basic Information */}
            <div className="grid gap-5 w-full">
              <TextField
                name="name"
                value={form.name}
                onChange={handleChange("name")}
                isInvalid={!!fieldErrors.name}
              >
                <Label>Full Name</Label>
                <Input placeholder="Enter your full name" />
                <FieldError>{fieldErrors.name}</FieldError>
              </TextField>

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
            </div>

            {/* Photo */}
            <TextField
              name="photoURL"
              value={form.image}
              onChange={handleChange("image")}
            >
              <Label>Photo URL</Label>
              <Input placeholder="https://example.com/photo.jpg" />
            </TextField>

            {/* Password */}
            <TextField
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange("password")}
              isInvalid={!!fieldErrors.password}
            >
              <Label>Password</Label>
              <Input placeholder="Enter password" />
              <FieldError>
                {fieldErrors.password ||
                  "Minimum 8 characters, one number and one special character"}
              </FieldError>
            </TextField>

            {/* Role Selection */}
            <RadioGroup
              name="role"
              value={form.role}
              onChange={handleChange("role")}
              orientation="horizontal"
              isInvalid={!!fieldErrors.role}
            >
              <Label>Select Role :</Label>
              <div className="flex gap-6">
                <Radio value="patient">
                  <Radio.Content>
                    <Radio.Control>
                      <Radio.Indicator />
                    </Radio.Control>
                    Patient
                  </Radio.Content>
                </Radio>
                <Radio value="doctor">
                  <Radio.Content>
                    <Radio.Control>
                      <Radio.Indicator />
                    </Radio.Control>
                    Doctor
                  </Radio.Content>
                </Radio>
              </div>
              <FieldError>{fieldErrors.role}</FieldError>
            </RadioGroup>

            {/* Doctor Fields */}
            {form.role === "doctor" && (
              <Card variant="secondary" className="w-full p-6">
                <Card.Header className="p-0 pb-5">
                  <Card.Title className="font-bold text-xl">
                    Professional Information
                  </Card.Title>
                </Card.Header>

                <Card.Content className="grid md:grid-cols-2 gap-5 p-0">
                  <TextField
                    name="specialization"
                    isRequired
                    value={form.specialization}
                    onChange={handleChange("specialization")}
                  >
                    <Label>Specialization</Label>
                    <Input placeholder="Cardiology" />
                  </TextField>

                  <TextField
                    name="qualifications"
                    isRequired
                    value={form.qualifications}
                    onChange={handleChange("qualifications")}
                  >
                    <Label>Qualifications</Label>
                    <Input placeholder="MBBS, FCPS" />
                  </TextField>

                  <TextField
                    name="experience"
                    isRequired
                    value={form.experience}
                    onChange={handleChange("experience")}
                  >
                    <Label>Experience</Label>
                    <Input placeholder="5 Years" />
                  </TextField>

                  <TextField
                    name="consultationFee"
                    type="number"
                    isRequired
                    value={form.consultationFee}
                    onChange={handleChange("consultationFee")}
                  >
                    <Label>Consultation Fee</Label>
                    <Input placeholder="500" />
                  </TextField>

                  <TextField
                    name="hospitalName"
                    isRequired
                    value={form.hospitalName}
                    onChange={handleChange("hospitalName")}
                    className="md:col-span-2"
                  >
                    <Label>Hospital Name</Label>
                    <Input placeholder="United Hospital" />
                  </TextField>
                </Card.Content>
              </Card>
            )}

            <Checkbox isRequired id="terms">
              <Checkbox.Content>
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
                I agree to the Terms & Conditions
              </Checkbox.Content>
            </Checkbox>
          </Card.Content>

          <Card.Footer className="p-0 mt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isPending={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </Card.Footer>
        </Form>
      </Card>
    </section>
  );
}