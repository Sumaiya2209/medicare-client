"use client";
import toast from "react-hot-toast";
import { useState } from "react";
import { bookAppointment } from "@/lib/api/appointments";
import { authClient } from "@/lib/auth-client";

export default function BookingForm({ doctor }) {
  const { data: session } = authClient.useSession();

  const [form, setForm] = useState({
    appointmentDate: "",
    appointmentTime: "",
    symptoms: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (!session?.user) {
      toast.error("Please login to book an appointment.");
      return;
    }

    setLoading(true);
    try {
      await bookAppointment({
        patientId: session.user.id,
        doctorId: doctor._id,
        appointmentDate: form.appointmentDate,
        appointmentTime: form.appointmentTime,
        symptoms: form.symptoms,
      });

      toast.success("Appointment booked successfully!");
      setForm({ appointmentDate: "", appointmentTime: "", symptoms: "" });
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border rounded-xl p-6 space-y-4 bg-white"
    >
      <h2 className="text-xl font-semibold">Book Appointment</h2>

      {status && (
        <div
          className={`text-sm rounded-lg px-3 py-2 ${status.type === "success"
            ? "bg-emerald-100 text-emerald-700"
            : "bg-red-100 text-red-700"
            }`}
        >
          {status.message}
        </div>
      )}

      <div>
        <label className="text-sm text-gray-600">Appointment Date</label>
        <input
          type="date"
          name="appointmentDate"
          value={form.appointmentDate}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-2 mt-1"
        />
      </div>

      <div>
        <label className="text-sm text-gray-600">Appointment Time</label>
        <input
          type="time"
          name="appointmentTime"
          value={form.appointmentTime}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-2 mt-1"
        />
      </div>

      <div>
        <label className="text-sm text-gray-600">Symptoms</label>
        <textarea
          name="symptoms"
          value={form.symptoms}
          onChange={handleChange}
          rows={3}
          placeholder="Describe your symptoms..."
          className="w-full border rounded-lg p-2 mt-1"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-700 text-white rounded-lg py-2 font-medium disabled:opacity-50"
      >
        {loading ? "Booking..." : "Confirm Appointment"}
      </button>
    </form>
  );
}