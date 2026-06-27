"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { getDoctorSchedule, updateDoctorSchedule } from "@/lib/api/doctors";
import toast from "react-hot-toast";

const DAYS = [
  "Monday", "Tuesday", "Wednesday",
  "Thursday", "Friday", "Saturday", "Sunday",
];

const DEFAULT_SLOTS = [
  "09:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "01:00 PM", "02:00 PM",
  "03:00 PM", "04:00 PM", "05:00 PM",
  "06:00 PM", "07:00 PM",
];

export default function ManageSchedulePage() {
  const { data: session } = authClient.useSession();

  const [availableDays, setAvailableDays] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [customSlot, setCustomSlot] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!session?.user?.id) return;

    getDoctorSchedule(session.user.id)
      .then((data) => {
        setAvailableDays(data.availableDays || []);
        setAvailableSlots(data.availableSlots || []);
      })
      .finally(() => setLoading(false));
  }, [session?.user?.id]);

  // Day toggle
  const toggleDay = (day) => {
    setAvailableDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  // Default slot toggle
  const toggleSlot = (slot) => {
    setAvailableSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };

  // Custom slot add
  const addCustomSlot = () => {
    const trimmed = customSlot.trim();
    if (!trimmed) return;
    if (availableSlots.includes(trimmed)) {
      toast.error("Slot already exists!");
      return;
    }
    setAvailableSlots((prev) => [...prev, trimmed]);
    setCustomSlot("");
    toast.success("Slot added!");
  };

  // Remove any slot
  const removeSlot = (slot) => {
    setAvailableSlots((prev) => prev.filter((s) => s !== slot));
  };

  // Save
  const handleSave = async () => {
    if (availableDays.length === 0) {
      toast.error("Please select at least one available day!");
      return;
    }
    if (availableSlots.length === 0) {
      toast.error("Please add at least one time slot!");
      return;
    }

    setSaving(true);
    try {
      await updateDoctorSchedule(session.user.id, availableDays, availableSlots);
      toast.success("Schedule updated successfully!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <p className="text-center py-20 text-gray-500">Loading schedule...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        Manage Schedule
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        Set your available days and time slots for appointments
      </p>

      {/* Available Days */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          📅 Available Days
        </h2>
        <div className="grid grid-cols-4 gap-3">
          {DAYS.map((day) => (
            <button
              key={day}
              onClick={() => toggleDay(day)}
              className={`py-2 px-3 rounded-xl text-sm font-medium transition-all border ${
                availableDays.includes(day)
                  ? "bg-emerald-700 text-white border-emerald-700"
                  : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-emerald-500"
              }`}
            >
              {day.slice(0, 3)}
            </button>
          ))}
        </div>

        {availableDays.length > 0 && (
          <p className="text-xs text-emerald-600 mt-3">
            ✓ Selected: {availableDays.join(", ")}
          </p>
        )}
      </div>

      {/* Time Slots */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          🕐 Time Slots
        </h2>

        {/* Default slots */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          Quick select:
        </p>
        <div className="grid grid-cols-4 gap-2 mb-5">
          {DEFAULT_SLOTS.map((slot) => (
            <button
              key={slot}
              onClick={() => toggleSlot(slot)}
              className={`py-2 px-2 rounded-xl text-xs font-medium transition-all border ${
                availableSlots.includes(slot)
                  ? "bg-emerald-700 text-white border-emerald-700"
                  : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-emerald-500"
              }`}
            >
              {slot}
            </button>
          ))}
        </div>

        {/* Custom slot input */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          Add custom slot:
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={customSlot}
            onChange={(e) => setCustomSlot(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCustomSlot()}
            placeholder="e.g. 08:30 AM"
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
          <button
            onClick={addCustomSlot}
            className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-sm font-medium hover:bg-emerald-800"
          >
            + Add
          </button>
        </div>

        {/* Selected slots */}
        {availableSlots.length > 0 && (
          <div className="mt-5">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your slots ({availableSlots.length}):
            </p>
            <div className="flex flex-wrap gap-2">
              {availableSlots.map((slot) => (
                <div
                  key={slot}
                  className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 rounded-full px-3 py-1 text-xs font-medium"
                >
                  {slot}
                  <button
                    onClick={() => removeSlot(slot)}
                    className="ml-1 text-emerald-500 hover:text-red-500 font-bold text-sm leading-none"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 mb-6 text-sm">
        <p className="text-gray-600 dark:text-gray-400">
          📋 <strong>{availableDays.length}</strong> days selected ·{" "}
          <strong>{availableSlots.length}</strong> time slots ·{" "}
          <strong>{availableDays.length * availableSlots.length}</strong> total weekly appointments possible
        </p>
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-emerald-700 text-white rounded-xl py-3 font-semibold text-sm disabled:opacity-50 hover:bg-emerald-800 transition-colors"
      >
        {saving ? "Saving..." : "💾 Save Schedule"}
      </button>
    </div>
  );
}