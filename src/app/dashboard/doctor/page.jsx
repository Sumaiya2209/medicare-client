"use client";

import { useEffect, useState } from "react";
import DoctorCard from "@/components/doctors/DoctorCard";
import DoctorFilters from "@/components/doctors/DoctorFilters";
import { getAllDoctors } from "@/lib/api/doctors";

const PAGE_SIZE = 8;

export default function FindDoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [layout, setLayout] = useState("grid");
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    search: "",
    specialization: "All Specializations",
    sort: "fee-asc",
  });

  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(filters.search), 400);
    return () => clearTimeout(t);
  }, [filters.search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filters.specialization, filters.sort]);

  useEffect(() => {
    setLoading(true);
    getAllDoctors({
      search: debouncedSearch,
      specialization: filters.specialization,
      sort: filters.sort,
      page,
      limit: PAGE_SIZE,
    })
      .then((data) => {
        setDoctors(data.doctors);
        setTotalPages(data.totalPages);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [debouncedSearch, filters.specialization, filters.sort, page]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900">Our Clinicians Catalogue</h1>
      <p className="text-gray-500 mt-1">
        Find professional guidance, sort by experience, highest rating, or browse by medical specialties.
      </p>

      <div className="mt-6">
        <DoctorFilters filters={filters} setFilters={setFilters} layout={layout} setLayout={setLayout} />
      </div>

      <div className="mt-8">
        {loading && <p className="text-center text-gray-500 py-10">Loading doctors...</p>}
        {error && <p className="text-center text-red-500 py-10">Error: {error}</p>}
        {!loading && !error && doctors.length === 0 && (
          <p className="text-center text-gray-500 py-10">No doctors match your search.</p>
        )}
        {!loading && !error && doctors.length > 0 && (
          <div className={layout === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-4"}>
            {doctors.map((doctor) => (
              <DoctorCard key={doctor._id} doctor={doctor} layout={layout} />
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-10 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`h-9 w-9 rounded-lg text-sm font-medium ${
                page === p ? "bg-gray-900 text-white" : "border border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}