"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { getDoctorByUserId, updateDoctorProfile } from "@/lib/api/doctors";
import toast from "react-hot-toast";
import Image from "next/image";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function DoctorProfilePage() {
  const { data: session } = authClient.useSession();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    qualifications: "",
    experience: "",
    consultationFee: "",
    hospitalName: "",
    specialization: "",
    availableDays: [],
    availableSlots: "",
  });

  useEffect(() => {
    if (!session?.user?.id) return;

    getDoctorByUserId(session.user.id)
      .then((data) => {
        setDoctor(data);
        setForm({
          qualifications: data.qualifications || "",
          experience: data.experience || "",
          consultationFee: data.consultationFee || "",
          hospitalName: data.hospitalName || "",
          specialization: data.specialization || "",
          availableDays: data.availableDays || [],
          availableSlots: data.availableSlots?.join(", ") || "",
        });
      })
      .finally(() => setLoading(false));
  }, [session?.user?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDayToggle = (day) => {
    setForm((prev) => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateDoctorProfile(session.user.id, {
        ...form,
        experience: Number(form.experience),
        consultationFee: Number(form.consultationFee),
        availableSlots: form.availableSlots
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <p className="text-center py-20 text-gray-500">Loading profile...</p>;

  if (!doctor)
    return <p className="text-center py-20 text-red-500">Doctor profile not found.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Management</h1>
      <p className="text-gray-500 mb-6">Update your professional information</p>

      {/* Profile header */}
      <div className="flex items-center gap-4 bg-white border rounded-2xl p-5 mb-6 shadow-sm">
        <div className="relative h-16 w-16 rounded-full overflow-hidden">
          <Image
            src={doctor.profileImage || "/placeholder-doctor.jpg"}
            alt={doctor.doctorName}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h2 className="font-bold text-gray-900 text-lg">{doctor.doctorName}</h2>
          <p className="text-sm text-gray-500">{doctor.email}</p>
          <span
            className={`mt-1 inline-block text-xs px-2 py-0.5 rounded-full font-medium ${
              doctor.verificationStatus === "verified"
                ? "bg-green-100 text-green-700"
                : doctor.verificationStatus === "rejected"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {doctor.verificationStatus || "pending"}
          </span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5 bg-white border rounded-2xl p-6 shadow-sm">

        {/* Specialization */}
        <div>
          <label className="text-sm font-medium text-gray-700">Specialization</label>
          <select
            name="specialization"
            value={form.specialization}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 mt-1 bg-white"
          >
            <option value="">Select specialization</option>
            {["Cardiology", "Neurology", "Orthopedics", "Pediatrics", "Dermatology", "General Medicine", "Gynecology", "Psychiatry"].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Qualifications */}
        <div>
          <label className="text-sm font-medium text-gray-700">Qualifications</label>
          <input
            type="text"
            name="qualifications"
            value={form.qualifications}
            onChange={handleChange}
            placeholder="MBBS, FCPS, MD..."
            className="w-full border rounded-lg p-2 mt-1"
          />
        </div>

        {/* Experience + Fee */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Experience (years)
            </label>
            <input
              type="number"
              name="experience"
              value={form.experience}
              onChange={handleChange}
              min="0"
              placeholder="5"
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Consultation Fee ($)
            </label>
            <input
              type="number"
              name="consultationFee"
              value={form.consultationFee}
              onChange={handleChange}
              min="0"
              placeholder="100"
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>
        </div>

        {/* Hospital */}
        <div>
          <label className="text-sm font-medium text-gray-700">Hospital Name</label>
          <input
            type="text"
            name="hospitalName"
            value={form.hospitalName}
            onChange={handleChange}
            placeholder="Apollo Hospital"
            className="w-full border rounded-lg p-2 mt-1"
          />
        </div>

        {/* Available Days */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Available Days
          </label>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => handleDayToggle(day)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  form.availableDays.includes(day)
                    ? "bg-emerald-700 text-white"
                    : "border border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {day.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>

        {/* Available Slots */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Available Time Slots
          </label>
          <input
            type="text"
            name="availableSlots"
            value={form.availableSlots}
            onChange={handleChange}
            placeholder="10:00 AM, 11:00 AM, 2:00 PM, 4:00 PM"
            className="w-full border rounded-lg p-2 mt-1"
          />
          <p className="text-xs text-gray-400 mt-1">
            Comma diye alag koro — jemon: 10:00 AM, 11:30 AM, 3:00 PM
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-emerald-700 text-white rounded-xl py-3 font-semibold disabled:opacity-50 hover:bg-emerald-800 transition-colors"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}