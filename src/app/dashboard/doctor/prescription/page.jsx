"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { getDoctorByUserId } from "@/lib/api/doctors";
import {
  getDoctorPrescriptions,
  createPrescription,
  updatePrescription,
} from "@/lib/api/prescriptions";
import { getDoctorAppointments } from "@/lib/api/appointments";
import toast from "react-hot-toast";

// Prescription Modal
function PrescriptionModal({ prescription, appointments, doctorId, onClose, onSuccess }) {
  const isEdit = !!prescription;

  const [form, setForm] = useState({
    appointmentId: prescription?.appointmentId || "",
    patientId: prescription?.patientId || "",
    diagnosis: prescription?.diagnosis || "",
    medications: prescription?.medications || "",
    notes: prescription?.notes || "",
  });
  const [loading, setLoading] = useState(false);

  const handleAppointmentChange = (e) => {
    const apptId = e.target.value;
    const selected = appointments.find((a) => a._id === apptId);
    setForm((prev) => ({
      ...prev,
      appointmentId: apptId,
      patientId: selected?.patientId || "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.diagnosis.trim()) {
      toast.error("Diagnosis is required!");
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        await updatePrescription(prescription._id, {
          diagnosis: form.diagnosis,
          medications: form.medications,
          notes: form.notes,
        });
        toast.success("Prescription updated!");
        onSuccess("update", prescription._id, form);
      } else {
        const result = await createPrescription({ ...form, doctorId });
        toast.success("Prescription created!");
        onSuccess("create", result.insertedId, form);
      }
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
          {isEdit ? "Edit Prescription" : "Create Prescription"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Appointment select */}
          {!isEdit && (
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400">
                Select Appointment
              </label>
              <select
                value={form.appointmentId}
                onChange={handleAppointmentChange}
                required
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 mt-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Choose appointment</option>
                {appointments
                  .filter((a) => a.appointmentStatus === "completed")
                  .map((a) => (
                    <option key={a._id} value={a._id}>
                      {a.patientInfo?.name || "Patient"} —{" "}
                      {a.appointmentDate} {a.appointmentTime}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {isEdit && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Patient:{" "}
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {prescription.patientInfo?.name || "Patient"}
                </span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Appointment:{" "}
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {prescription.appointmentInfo?.appointmentDate}{" "}
                  {prescription.appointmentInfo?.appointmentTime}
                </span>
              </p>
            </div>
          )}

          {/* Diagnosis */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Diagnosis *
            </label>
            <textarea
              value={form.diagnosis}
              onChange={(e) => setForm((p) => ({ ...p, diagnosis: e.target.value }))}
              rows={3}
              required
              placeholder="Enter diagnosis..."
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 mt-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Medications */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Medications
            </label>
            <textarea
              value={form.medications}
              onChange={(e) => setForm((p) => ({ ...p, medications: e.target.value }))}
              rows={3}
              placeholder="e.g. Paracetamol 500mg - 3 times daily, Amoxicillin 250mg..."
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 mt-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Additional Notes
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
              rows={2}
              placeholder="Follow-up instructions, dietary advice..."
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 mt-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-xl py-2 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-emerald-700 text-white rounded-xl py-2 text-sm font-medium disabled:opacity-50"
            >
              {loading ? "Saving..." : isEdit ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function PrescriptionPage() {
  const { data: session } = authClient.useSession();

  const [prescriptions, setPrescriptions] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [doctorId, setDoctorId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  useEffect(() => {
    if (!session?.user?.id) return;

    getDoctorByUserId(session.user.id)
      .then((doctor) => {
        setDoctorId(doctor._id);
        return Promise.all([
          getDoctorPrescriptions(doctor._id),
          getDoctorAppointments(doctor._id),
        ]);
      })
      .then(([prescriptionsData, appointmentsData]) => {
        setPrescriptions(prescriptionsData);
        setAppointments(appointmentsData);
      })
      .finally(() => setLoading(false));
  }, [session?.user?.id]);

  const handleModalSuccess = (type, id, data) => {
    if (type === "update") {
      setPrescriptions((prev) =>
        prev.map((p) =>
          p._id === id ? { ...p, ...data } : p
        )
      );
    } else {
      // Refetch
      getDoctorPrescriptions(doctorId).then(setPrescriptions);
    }
  };

  if (loading)
    return <p className="text-center py-20 text-gray-500">Loading prescriptions...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Prescription Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {prescriptions.length} prescriptions created
          </p>
        </div>
        <button
          onClick={() => {
            setEditTarget(null);
            setShowModal(true);
          }}
          className="bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-emerald-800"
        >
          + New Prescription
        </button>
      </div>

      {prescriptions.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-4">📋</p>
          <p className="text-lg font-medium">No prescriptions yet</p>
          <p className="text-sm mt-1">
            Mark an appointment as completed to create a prescription
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {prescriptions.map((prescription) => (
            <div
              key={prescription._id}
              className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold">
                      {prescription.patientInfo?.name?.charAt(0) || "P"}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-100">
                        {prescription.patientInfo?.name || "Patient"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        📅{" "}
                        {prescription.appointmentInfo?.appointmentDate || ""}{" "}
                        {prescription.appointmentInfo?.appointmentTime || ""}
                      </p>
                    </div>
                  </div>

                  {/* Diagnosis */}
                  <div className="mb-2">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Diagnosis
                    </span>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">
                      {prescription.diagnosis}
                    </p>
                  </div>

                  {/* Medications */}
                  {prescription.medications && (
                    <div className="mb-2">
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Medications
                      </span>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">
                        {prescription.medications}
                      </p>
                    </div>
                  )}

                  {/* Notes */}
                  {prescription.notes && (
                    <div>
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Notes
                      </span>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                        {prescription.notes}
                      </p>
                    </div>
                  )}

                  <p className="text-xs text-gray-400 mt-3">
                    Created:{" "}
                    {new Date(prescription.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                    {prescription.updatedAt && " (edited)"}
                  </p>
                </div>

                {/* Edit button */}
                <button
                  onClick={() => {
                    setEditTarget(prescription);
                    setShowModal(true);
                  }}
                  className="ml-4 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-lg hover:bg-blue-200 font-medium"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <PrescriptionModal
          prescription={editTarget}
          appointments={appointments}
          doctorId={doctorId}
          onClose={() => {
            setShowModal(false);
            setEditTarget(null);
          }}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
}