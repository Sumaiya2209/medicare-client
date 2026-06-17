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
    <header className="sticky top-0 z-50 bg-cyan-600 border-b w-full">
      <div className="container max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <Image
              src={Logo}
              alt="MediCare Connect"
              width={400}
              height={100}
            />
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-end gap-5 ">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-1 text-sm font-bold hover:text-primary transition hover:bg-white hover:text-blue-950 transition-all duration-500 hover:scale-105 p-2 rounded-md"
              >
                <Icon data={item.icon} size={16} />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/login">
              <Button variant="bordered" className="font-bold hover:bg-white hover:text-blue-950 transition-all duration-500 hover:scale-105">
                Login
              </Button>
            </Link>
            <div className="w-px h-5 bg-gray-500" />

            <Link href="/register" className="ml-3">
              <Button
                className="
      font-bold
      bg-blue-950
      text-white
      hover:bg-white
      hover:text-blue-950
      transition-all
      duration-500
      hover:scale-105
    "
              >
                Register
              </Button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden"
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
            <div className="flex flex-col gap-4">

              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3"
                >
                  <Icon data={item.icon} size={18} />
                  {item.label}
                </Link>
              ))}

              <div className="flex flex-col gap-2 pt-3">
                <Link href="/login">
                  <Button
                    variant="bordered"
                    className="w-full hover:bg-white hover:text-blue-950 transition-all duration-500 hover:scale-105"
                  >
                    Login
                  </Button>
                </Link>

                <Link href="/register">
                  <Button
                    color="primary"
                    className="w-full hover:bg-white hover:text-blue-950 transition-all duration-500 hover:scale-105"
                  >
                    Register
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