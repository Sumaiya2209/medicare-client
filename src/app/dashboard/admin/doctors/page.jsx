"use client";

import { useEffect, useState } from "react";
import { getAllDoctorsAdmin, updateDoctorVerification } from "@/lib/api/admin";
import toast from "react-hot-toast";

const verificationStyles = {
  verified: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-700",
};

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    getAllDoctorsAdmin()
      .then(setDoctors)
      .finally(() => setLoading(false));
  }, []);

  const handleVerification = async (id, status) => {
    try {
      await updateDoctorVerification(id, status);
      setDoctors((prev) =>
        prev.map((d) =>
          d._id === id ? { ...d, verificationStatus: status } : d
        )
      );
      toast.success(`Doctor ${status}!`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const filtered =
    filter === "all"
      ? doctors
      : doctors.filter((d) => d.verificationStatus === filter);

  if (loading)
    return <p className="text-center py-20 text-gray-500">Loading doctors...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Manage Doctors</h1>
      <p className="text-gray-500 mb-6">{doctors.length} total doctors</p>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {["all", "pending", "verified", "rejected"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
              filter === f
                ? "bg-gray-900 text-white"
                : "border border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {f}
            {f === "pending" && (
              <span className="ml-1 bg-yellow-400 text-yellow-900 text-xs px-1.5 rounded-full">
                {doctors.filter((d) => d.verificationStatus === "pending").length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Doctor</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Specialization</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Hospital</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Fee</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Status</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((doctor) => (
              <tr key={doctor._id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-800">{doctor.doctorName}</p>
                  <p className="text-xs text-gray-400">{doctor.qualifications}</p>
                </td>
                <td className="px-4 py-3 text-gray-600">{doctor.specialization}</td>
                <td className="px-4 py-3 text-gray-600">{doctor.hospitalName}</td>
                <td className="px-4 py-3 text-gray-600">${doctor.consultationFee}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize
                    ${verificationStyles[doctor.verificationStatus] || verificationStyles.pending}`}>
                    {doctor.verificationStatus || "pending"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 flex-wrap">
                    {doctor.verificationStatus !== "verified" && (
                      <button
                        onClick={() => handleVerification(doctor._id, "verified")}
                        className="px-3 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200"
                      >
                        ✓ Verify
                      </button>
                    )}
                    {doctor.verificationStatus !== "rejected" && (
                      <button
                        onClick={() => handleVerification(doctor._id, "rejected")}
                        className="px-3 py-1 rounded-lg text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200"
                      >
                        ✗ Reject
                      </button>
                    )}
                    {doctor.verificationStatus === "verified" && (
                      <button
                        onClick={() => handleVerification(doctor._id, "pending")}
                        className="px-3 py-1 rounded-lg text-xs font-medium bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                      >
                        Cancel Verify
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}