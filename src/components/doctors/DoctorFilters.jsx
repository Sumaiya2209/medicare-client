"use client";

import { IconSearch, IconLayoutGrid, IconList } from "@tabler/icons-react";

const SPECIALIZATIONS = [
  "All Specializations",
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Dermatology",
];

const SORT_OPTIONS = [
  { value: "fee-asc", label: "Fee: Low to High" },
  { value: "fee-desc", label: "Fee: High to Low" },
  { value: "rating-desc", label: "Highest Rating" },
  { value: "experience-desc", label: "Most Experienced" },
];

export default function DoctorFilters({ filters, setFilters, layout, setLayout }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <label className="text-xs font-medium text-gray-500">SEARCH DOCTOR NAME</label>
        <div className="relative mt-1">
          <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="e.g. Amanda Ross..."
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
            className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-500">MEDICAL SPECIALTIES</label>
        <select
          value={filters.specialization}
          onChange={(e) => setFilters((f) => ({ ...f, specialization: e.target.value }))}
          className="mt-1 w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
        >
          {SPECIALIZATIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-500">SORT CLINIC FEE / QUALITY</label>
        <select
          value={filters.sort}
          onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
          className="mt-1 w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-500">LAYOUT FORMAT</label>
        <div className="mt-1 flex rounded-lg border border-gray-300 p-1 w-fit">
          <button
            onClick={() => setLayout("grid")}
            className={`p-1.5 rounded ${layout === "grid" ? "bg-gray-900 text-white" : "text-gray-400"}`}
          >
            <IconLayoutGrid size={16} />
          </button>
          <button
            onClick={() => setLayout("list")}
            className={`p-1.5 rounded ${layout === "list" ? "bg-gray-900 text-white" : "text-gray-400"}`}
          >
            <IconList size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}