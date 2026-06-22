"use client";

import Image from "next/image";
import Logo from "@/images/medicare_logo.png";

import { useState } from "react";

import { Button } from "@heroui/react";

import { Icon } from "@gravity-ui/uikit";
import { Dropdown } from "@heroui/react";


import {
  Bars,
  Xmark,
  House,
  Stethoscope,
  CircleInfo,
  Envelope,
  PersonFill,
  ChevronDownWide,
} from "@gravity-ui/icons";
import { signOut, useSession } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";

const navLinks = [
  {
    label: "Home",
    href: "/",
    icon: House,
  },
  {
    label: "Find Doctors",
    href: "/auth/finddoctors",
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

  const router = useRouter();

  const [open, setOpen] = useState(false);
  const { data } = useSession();
  const user = data?.user

  const handleSignout = async () => {
    await signOut();
    router.push("/");
  }

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
          <nav className="hidden lg:flex items-end gap-2 ">
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
            {user ? (
              <Dropdown>
                <Button
                  className="bg-white text-blue-950 font-semibold "
                  aria-label="Menu"
                  variant="flat"
                >
                  <PersonFill />
                  {user?.name || "User"}
                  <ChevronDownWide className="ml-1 font-bold mt-2" />
                </Button>

                <Dropdown.Popover>
                  <Dropdown.Menu className="">
                    <Dropdown.Item id="dashboard">
                      <Link className="pl-4 font-semibold" href={user?.role === "doctor" ? "/dashboard/doctor" : "/dashboard/patient"}>
                        Dashboard
                      </Link>
                    </Dropdown.Item>

                    <Dropdown.Item id="profile">
                      <Link href="/profile" className="pl-4 font-semibold">Profile</Link>
                    </Dropdown.Item>

                    <Dropdown.Item id="signout">
                      <Button onClick={handleSignout} variant="bordered" className="pl-4 font-semibold text-red-500">
                        Sign Out
                      </Button>
                    </Dropdown.Item>

                  </Dropdown.Menu>
                </Dropdown.Popover>
              </Dropdown>
            )

              : (
                <>
                  <Link href="/auth/signin">
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
                </>
              )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden text-white px-4"
          >
            <Icon
              data={open ? Xmark : Bars}
              size={22}
            />
          </button>

          {/* Mobile Menu */}
          {open && (
            <div className="lg:hidden absolute top-20 left-0 w-full bg-[#0B1F3A] border-t border-gray-700 shadow-xl">
              <div className="flex flex-col p-4 gap-2">

                {/* Navigation Links */}
                {navLinks.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="
            flex items-center gap-3
            text-white
            px-4 py-3
            rounded-xl
            hover:bg-white
            hover:text-blue-950
            transition-all duration-300
          "
                  >
                    <Icon data={item.icon} size={18} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}

                {user && (
                  <>
                    <div className="border-t border-gray-700 my-2" />

                    <Link
                      href={
                        user?.role === "doctor"
                          ? "/dashboard/doctor"
                          : "/dashboard/patient"
                      }
                      onClick={() => setOpen(false)}
                      className="
              flex items-center gap-3
              text-white
              px-4 py-3
              rounded-xl
              hover:bg-white
              hover:text-blue-950
              transition-all duration-300
            "
                    >
                      <PersonFill />
                      Dashboard
                    </Link>

                    <Link
                      href="/profile"
                      onClick={() => setOpen(false)}
                      className="
              flex items-center gap-3
              text-white
              px-4 py-3
              rounded-xl
              hover:bg-white
              hover:text-blue-950
              transition-all duration-300
            "
                    >
                      <PersonFill />
                      Profile
                    </Link>
                  </>
                )}

                <div className="border-t border-gray-700 my-2" />

                {user ? (
                  <Button
                    onClick={handleSignout}
                    className="
            w-full
            bg-red-600
            text-white
            font-semibold
            h-12
          "
                  >
                    Sign Out
                  </Button>
                ) : (
                  <>
                    <Link
                      href="/auth/signin"
                      onClick={() => setOpen(false)}
                    >
                      <Button
                        variant="bordered"
                        className="
                w-full
                text-white
                h-12
                font-semibold
              "
                      >
                        Sign In
                      </Button>
                    </Link>

                    <Link
                      href="/auth/signup"
                      onClick={() => setOpen(false)}
                    >
                      <Button
                        className="
                w-full
                bg-white
                text-blue-950
                h-12
                font-semibold
              "
                      >
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header >
  );
}