"use client";

import Link from "next/link";
import Image from "next/image";
import Logo from "@/images/medicare_logo.png";

import { useState } from "react";

import { Button } from "@heroui/react";

import { Icon } from "@gravity-ui/uikit";

import {
  Bars,
  Xmark,
  House,
  Stethoscope,
  CircleInfo,
  Envelope,
  LayoutCells,
} from "@gravity-ui/icons";

const navLinks = [
  {
    label: "Home",
    href: "/",
    icon: House,
  },
  {
    label: "Find Doctors",
    href: "/doctors",
    icon: Stethoscope,
  },
  {
    label: "About Us",
    href: "/about",
    icon: CircleInfo,
  },
  {
    label: "Contact Us",
    href: "/contact",
    icon: Envelope,
  },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#0B1F3A] border-b w-full"
    >
      <div className="container max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center p-10 lg:p-0 gap-3"
          >
            <Image
              src={Logo}
              alt="MediCare Connect"
              width={400}
              height={120}
            />
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-end gap-5 ">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center text-white gap-1 text-sm font-bold hover:text-primary transition hover:bg-white hover:text-blue-950 transition-all duration-500 hover:scale-105 p-3 rounded-full"
              >
                <Icon data={item.icon} size={16} />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="bordered" className="font-bold text-white hover:bg-white hover:text-blue-950 transition-all duration-500 hover:scale-105">
                Sign In
              </Button>
            </Link>
            <div className="w-px h-5 bg-gray-500" />

            <Link href="/auth/signup" className="ml-3">
              <Button
                className="
      font-bold
      text-blue-950
      bg-white
      transition-all
      duration-500
      hover:scale-110
    "
              >
                Sign Up
              </Button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden text-white p-10"
          >
            <Icon
              data={open ? Xmark : Bars}
              size={22}
            />
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="lg:hidden pb-6">
            <div className="flex flex-col ">

              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center pl-6 text-white hover:bg-white hover:text-blue-950 p-2 rounded-2xl gap-3"
                >
                  <Icon data={item.icon} size={18} />
                  {item.label}
                </Link>
              ))}

              <div className="flex flex-col gap-2 pt-3">
                <Link href="/auth/login">
                  <Button
                    variant="bordered"
                    className="w-full text-white hover:bg-white hover:text-blue-950 transition-all duration-500 hover:scale-105"
                  >
                    Sign In
                  </Button>
                </Link>

                <Link href="/auth/signup">
                  <Button
                    color="primary"
                    className="w-full bg-white hover:text-blue-950 transition-all duration-500 hover:scale-105"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>

            </div>
          </div>
        )}
      </div>
    </header>
  );
}