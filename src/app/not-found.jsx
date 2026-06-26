"use client";

import Link from "next/link";
import { Button } from "@heroui/react";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-50 via-white to-cyan-50 px-6">
      <div className="max-w-2xl text-center">

        {/* Error Code */}
        <h1 className="text-8xl font-extrabold text-blue-950 md:text-9xl">
          404
        </h1>

        {/* Title */}
        <h2 className="mt-6 text-3xl font-bold text-gray-800">
          Oops! Page Not Found
        </h2>

        {/* Description */}
        <p className="mt-4 text-lg leading-relaxed text-gray-600">
          The page you're looking for doesn't exist or may have been moved.
          If you're searching for a doctor, appointment, or medical service,
          use the buttons below to continue exploring MediCare.
        </p>


        {/* Buttons */}
        <div className="flex flex-col justify-center gap-4 sm:flex-row mt-15">

          <Link href="/">
            <Button
              className="font-semibold bg-blue-950 text-white"
              size="lg"
              startContent={<Home size={20} />}
            >
              Go to Home
            </Button>
          </Link>

          <Button
            variant="bordered"
            size="lg"
            startContent={<ArrowLeft size={20} />}
            onPress={() => window.history.back()}
            className="font-semibold hover:bg-blue-950 hover:text-white"
          >
            Go Back
          </Button>

        </div>


      </div>
    </section>
  );
}