"use client";

import Image from "next/image";
import { Button } from "@heroui/react";
import { motion } from "framer-motion";
import { Icon } from "@gravity-ui/uikit";
import { Calendar, HeartPulse } from "@gravity-ui/icons";

import BannerImage from "@/images/medical-healthcare-banner.jpg"; 
export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden max-w-7xl mx-auto my-10 rounded-lg">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={BannerImage}
          alt="Healthcare Background"
          fill
        />
      </div>
 
      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex mb-10 items-center justify-center text-start mt-25 ml-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-gray-200 px-4 py-2 backdrop-blur-md">
              <Icon data={HeartPulse} size={16} />
              <span className="text-sm font-medium text-gray-800">
                Trusted Healthcare Platform
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-extrabold leading-tight text-gray-800 md:text-6xl">
              MediCare Connect
            </h1>

            <h2 className="mt-4 text-2xl font-semibold text-gray-600 md:text-3xl">
              Hospital Appointment & Healthcare Management System
            </h2>

            <p className="mt-6 max-w-2xl text-sm leading-8 text-slate-400">
              Book appointments with trusted doctors, manage medical records,
              track treatments, and access healthcare services from one
              centralized platform.
            </p>

            {/* CTA */}
            <div className="mt-10 flex flex-wrap gap-4 ">
              <Button
                size="lg"
                className="font-semibold bg-blue-950 border-2 text-white hover:bg-white hover:text-cyan-950"
              >
                <Icon data={Calendar} size={18} />
                Book Appointment
              </Button>

              <Button
                size="lg"
                variant="bordered"
                className="border-white text-black border-2 hover:bg-white hover:text-cyan-950"
              >
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}