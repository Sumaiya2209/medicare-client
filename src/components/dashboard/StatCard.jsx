"use client";

export default function StatCard({
  title,
  value,
  icon,
  suffix = "",
}) {
  return (
    <div
      className="
      text-center
      mt-10
        rounded-2xl
        p-5
        shadow-lg
        border
        transition-all
        duration-300
        hover:-translate-y-1
      "
    >
      <div className="flex h-30 items-center justify-center">
        <div>
          <p className="text-sm text-gray-800 font-medium">
            {title}
          </p>

          <h3 className="mt-2 text-3xl font-bold text-gray-800">
            {value}
            {suffix}
          </h3>
        </div>

        {icon && (
          <div className="text-blue-500">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}