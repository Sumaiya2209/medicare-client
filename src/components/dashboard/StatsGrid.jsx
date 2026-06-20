"use client";

import { useSession } from "@/lib/auth-client";
import StatCard from "./StatCard";

export default function StatsGrid({ stats }) {
  const { data } = useSession();
  const role = data?.user?.role ;

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 gap-4  mx-10 ${
    role === "doctor"
      ? "lg:grid-cols-3"
      : "lg:grid-cols-4"
  }`}
    >
      {stats.map((item) => (
        <StatCard
          key={item.title}
          title={item.title}
          value={item.value}
          suffix={item.suffix}
          icon={item.icon}
        />
      ))}
    </div>
  );
}