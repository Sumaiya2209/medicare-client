"use client";

import StatCard from "./StatCard";

export default function StatsGrid({ stats }) {
  return (
    <div
      className="
        grid
        grid-cols-1
        sm:grid-cols-2
        xl:grid-cols-4
        gap-4
        mx-10
      "
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