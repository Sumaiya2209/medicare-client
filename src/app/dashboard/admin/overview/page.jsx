"use client";

import { useEffect, useState } from "react";
import { getAnalytics } from "@/lib/api/admin";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie,
  Cell, Legend,
} from "recharts";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function AdminOverviewPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalytics()
      .then(setAnalytics)
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <p className="text-center py-20 text-gray-500">Loading analytics...</p>;

  const stats = [
    { title: "Total Doctors", value: analytics.totalDoctors, color: "text-emerald-600" },
    { title: "Total Patients", value: analytics.totalPatients, color: "text-blue-600" },
    { title: "Total Appointments", value: analytics.totalAppointments, color: "text-amber-600" },
    { title: "Paid Appointments", value: analytics.totalPaid, color: "text-purple-600" },
  ];

  const monthlyChartData = analytics.monthlyData.map((d) => ({
    month: d._id,
    appointments: d.count,
  }));

  const doctorChartData = analytics.doctorPerformance.map((d) => ({
    name: d.doctorName?.split(" ").slice(-1)[0] || "Dr",
    rating: d.rating || 0,
  }));

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-2xl border bg-white p-5 shadow-sm text-center"
          >
            <p className="text-sm text-gray-500">{stat.title}</p>
            <p className={`text-3xl font-bold mt-1 ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Appointments Bar Chart */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Monthly Appointments</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="appointments" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Doctor Performance Pie Chart */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">
            Doctor Performance (Rating)
          </h2>
          {doctorChartData.every((d) => d.rating === 0) ? (
            <p className="text-gray-400 text-sm text-center py-10">
              No rating data yet
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={doctorChartData}
                  dataKey="rating"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {doctorChartData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}