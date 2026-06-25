
"use client";

import Image from "next/image";
import { Button } from "@heroui/react";
import TipsBg from "@/images/medical-bg.avif";

const tips = [
  {
    title: "Stay Hydrated",
    description:
      "Drink at least 8 glasses of water daily to maintain overall health.",
  },
  {
    title: "Exercise Regularly",
    description:
      "Engage in 30 minutes of physical activity each day.",
  },
  {
    title: "Get Enough Sleep",
    description:
      "Aim for 7–9 hours of quality sleep every night.",
  },
  {
    title: "Eat a Balanced Diet",
    description:
      "Include fruits, vegetables, proteins, and whole grains.",
  },
];

export default function MedicalTips() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
      <div className="relative overflow-hidden py-10 rounded-[32px] min-h-[600px]">
        {/* Background Image */}
        <Image
          src={TipsBg}
          alt="Medical Tips Background"
          fill
          priority
          className="object-cover"
        />

        {/* Light Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-white/80" />

        {/* Content */}
        <div className="relative z-10 flex items-center justify-end min-h-[600px] px-6 md:px-12 lg:px-16">
          <div className="w-full max-w-xl">
            {/* Heading */}
            <div className="mb-8 text-left">
              <span className="inline-flex items-center rounded-full bg-gray-200 px-3 py-1.5 text-xs font-semibold text-cyan-700">
                HEALTHCARE GUIDE
              </span>

              <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
                Daily Medical Tips
              </h2>

              <p className="mt-2 text-base leading-7 text-slate-700">
                Small healthy habits can make a big difference in your overall
                well-being.
              </p>
            </div>

            {/* Tips */}
            <div className="space-y-2 ">
              {tips.map((tip, index) => (
                <div
                  key={index}
                  className="
                    group
                    rounded-xl
                    border
                    border-white/30
                    bg-white/80
                    p-4
                    shadow-md
                    backdrop-blur-sm
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:bg-white/95
                    hover:shadow-xl
                  "
                >
                  <div className="flex gap-3">
                    {/* Number */}
                    <div
                      className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-gradient-to-br
                        from-cyan-500
                        to-cyan-600
                        text-sm
                        font-bold
                        text-white
                        shadow-md
                        transition-all
                        duration-300
                        group-hover:scale-110
                      "
                    >
                      {index + 1}
                    </div>

                    {/* Text */}
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">
                        {tip.title}
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {tip.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-8">
              <Button
                radius="full"
                size="md"
                className="px-6 font-semibold shadow-lg bg-blue-950 border-2 transition-all duration-300 hover:scale-105"
              >
                Read More Health Tips
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
