"use client";

import { Card, Button } from "@heroui/react";
import { Icon } from "@gravity-ui/uikit";
import {
  HeartPulse,
  Stethoscope,
  Persons,
  FaceSmile,
  CircleInfo,
} from "@gravity-ui/icons";

const departments = [
  {
    title: "Cardiology",
    description:
      "Diagnosis and treatment of heart and cardiovascular diseases.",
    icon: HeartPulse,
  },
  {
    title: "Neurology",
    description:
      "Specialized care for brain and nervous system disorders.",
    icon: CircleInfo,
  },
  {
    title: "Orthopedics",
    description:
      "Expert treatment for bones, joints, muscles, and injuries.",
    icon: Stethoscope,
  },
  {
    title: "Pediatrics",
    description:
      "Dedicated healthcare services for infants and children.",
    icon: Persons,
  },
  {
    title: "Dermatology",
    description:
      "Skin, hair, and nail treatments from expert specialists.",
    icon: FaceSmile,
  },
  {
    title: "General Medicine",
    description:
      "Comprehensive healthcare and preventive medical services.",
    icon: Stethoscope,
  },
];

export default function MedicalSpecializations() {
  return (
    <section className="py-24 bg-gray-100 mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ">
        {/* Heading */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span className="text-primary font-semibold">
            MEDICAL SPECIALIZATIONS
          </span>

          <h2 className="mt-3 text-4xl font-bold">
            Find the Right Specialist
          </h2>

          <p className="mt-4 text-default-500">
            Connect with experienced doctors across multiple medical
            specialties and receive quality healthcare services.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 ">
          {departments.map((item) => (
            <Card
              key={item.title}
              variant="secondary"
              className="
    group
    overflow-hidden
    border border-white/10
    bg-white/80
    backdrop-blur-sm
    shadow-lg
    hover:shadow-2xl
    hover:shadow-cyan-500/20
    transition-all
    duration-500
    hover:-translate-y-3
  "
            >
              <Card.Header>
                <div
                  className="
        flex h-14 w-14 items-center justify-center
        rounded-2xl
        bg-gradient-to-br
        from-cyan-500
        to-blue-600
        text-white
        shadow-lg
        transition-all
        duration-500
        group-hover:scale-110
      "
                >
                  <Icon data={item.icon} size={30} />
                </div>
              </Card.Header>

              <Card.Content>
                <Card.Title className="text-xl font-bold">
                  {item.title}
                </Card.Title>

                <Card.Description className=" text-base leading-relaxed text-default-500">
                  {item.description}
                </Card.Description>
              </Card.Content>

              <Card.Footer className="flex justify-between items-center">
                <span className="text-sm text-cyan-600 font-medium ">
                  Expert Care
                </span>

                <Button
                  color="primary"
                  variant="flat"
                  radius="full"
                  className="font-semibold border-2 border-blue-600 transition-all duration-300 hover:scale-105"
                >
                  View Doctors
                </Button>
              </Card.Footer>

              {/* Decorative Glow */}
              <div
                className="
      absolute
      -right-10
      -top-10
      h-24
      w-24
      rounded-full
      bg-cyan-500/10
      blur-2xl
      opacity-0
      transition-all
      duration-500
      group-hover:opacity-100
    "
              />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}