"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { bookAppointment, getBookedSlots } from "@/lib/api/appointments";
import { authClient } from "@/lib/auth-client";

export default function BookingForm({ doctor }) {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [form, setForm] = useState({
    appointmentDate: "",
    appointmentTime: "",
    symptoms: "",
  });

  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loading, setLoading] = useState(false);

  const slots = doctor.availableSlots || [];
  const today = new Date().toISOString().split("T")[0];

  // Date select korle booked slots fetch koro
  useEffect(() => {
    if (!form.appointmentDate || !doctor._id) return;

    setLoadingSlots(true);
    setForm((prev) => ({ ...prev, appointmentTime: "" })); // time reset

    getBookedSlots(doctor._id, form.appointmentDate)
      .then(setBookedSlots)
      .catch(() => setBookedSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [form.appointmentDate, doctor._id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!session?.user) {
      toast.error("Please login to book an appointment.");
      return;
    }

    if (!form.appointmentTime) {
      toast.error("Please select a time slot.");
      return;
    }

    setLoading(true);
    try {
      const result = await bookAppointment({
        patientId: session.user.id,
        doctorId: doctor._id,
        appointmentDate: form.appointmentDate,
        appointmentTime: form.appointmentTime,
        symptoms: form.symptoms,
      });

      toast.success("Redirecting to payment...");
      router.push(`/payment/${result.insertedId}`);
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const availableCount = slots.filter((s) => !bookedSlots.includes(s)).length;

  return (
    <form
      onSubmit={handleSubmit}
      className="border rounded-xl p-6 space-y-4 bg-white"
    >
      <h2 className="text-xl font-semibold">Book Appointment</h2>

      {/* Date */}
      <div>
        <label className="text-sm text-gray-600">Appointment Date</label>
        <input
          type="date"
          name="appointmentDate"
          value={form.appointmentDate}
          onChange={handleChange}
          min={today}
          required
          className="w-full border rounded-lg p-2 mt-1"
        />
      </div>

      {/* Time Slots */}
      <div>
        <label className="text-sm text-gray-600">
          Select Time Slot
          {form.appointmentDate && (
            <span className="ml-2 text-xs text-emerald-600">
              ({availableCount} slots available)
            </span>
          )}
        </label>

        {!form.appointmentDate ? (
          <p className="text-sm text-gray-400 mt-1 border rounded-lg p-2">
            Please select a date first
          </p>
        ) : loadingSlots ? (
          <p className="text-sm text-gray-400 mt-1 border rounded-lg p-2">
            Checking available slots...
          </p>
        ) : slots.length === 0 ? (
          <p className="text-sm text-gray-400 mt-1">
            No slots available for this doctor.
          </p>
        ) : (
          /* Slot buttons */
          <div className="grid grid-cols-3 gap-2 mt-2">
            {slots.map((slot) => {
              const isBooked = bookedSlots.includes(slot);
              const isSelected = form.appointmentTime === slot;

              return (
                <button
                  key={slot}
                  type="button"
                  disabled={isBooked}
                  onClick={() =>
                    !isBooked &&
                    setForm((prev) => ({ ...prev, appointmentTime: slot }))
                  }
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-all border
                    ${isBooked
                      ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through"
                      : isSelected
                      ? "bg-emerald-700 text-white border-emerald-700"
                      : "bg-white text-gray-700 border-gray-300 hover:border-emerald-500 hover:text-emerald-600"
                    }`}
                >
                  {slot}
                  {isBooked && (
                    <span className="block text-xs font-normal">Booked</span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Symptoms */}
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
        disabled={loading || !form.appointmentTime || slots.length === 0}
        className="w-full bg-emerald-700 text-white rounded-lg py-2 font-medium disabled:opacity-50"
      >
        {loading ? "Booking..." : "Confirm Appointment"}
      </button>
    </form>
  );
}