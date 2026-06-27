"use client";

import Image from "next/image";
import Logo from "@/images/medicare_logo.png";
import { useState } from "react";
import { Button } from "@heroui/react";
import { Icon } from "@gravity-ui/uikit";
import { Dropdown } from "@heroui/react";
import ThemeToggle from "@/components/Home/ThemeToggle";
import {
  Bars, Xmark, House, Stethoscope,
  CircleInfo, Envelope, PersonFill, ChevronDownWide,
} from "@gravity-ui/icons";
import { signOut, useSession } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";

const navLinks = [
  { label: "Home", href: "/", icon: House },
  { label: "Find Doctors", href: "/auth/finddoctors", icon: Stethoscope },
  { label: "About Us", href: "/about", icon: CircleInfo },
  { label: "Contact Us", href: "/contact", icon: Envelope },
];

export default function Navbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { data } = useSession();
  const user = data?.user;

  const handleSignout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0B1F3A] border-b border-blue-900 w-full">
      <div className="container max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center p-10 lg:p-0 gap-3">
            <Image src={Logo} alt="MediCare Connect" width={400} height={120} />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-end gap-2">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center text-white gap-1 text-sm font-bold hover:bg-white hover:text-blue-950 transition-all duration-300 hover:scale-105 p-3 rounded-full"
              >
                <Icon data={item.icon} size={16} />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Right Side */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <Dropdown>
                <Button
                  className="bg-white text-blue-950 font-semibold transition-all duration-300 hover:scale-105"
                  aria-label="Menu"
                  variant="flat"
                >
                  <PersonFill />
                  {user?.name || "User"}
                  <ChevronDownWide className="ml-1 font-bold mt-2" />
                </Button>

                <Dropdown.Popover>
                  <Dropdown.Menu>
                    <Dropdown.Item id="dashboard">
                      <Link
                        className="pl-4 font-semibold"
                        href={
                          user?.role === "doctor"
                            ? "/dashboard/doctor/overview"
                            : user?.role === "admin"
                              ? "/dashboard/admin/overview"
                              : "/dashboard/patient/overview"
                        }
                      >
                        Dashboard
                      </Link>
                    </Dropdown.Item>

                    <Dropdown.Item id="profile">
                      <Link href="/profile" className="pl-4 font-semibold">
                        Profile
                      </Link>
                    </Dropdown.Item>

                    <Dropdown.Item id="signout">
                      <button
                        onClick={handleSignout}
                        className="pl-4 font-semibold text-red-500 w-full text-left"
                      >
                        Sign Out
                      </button>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown.Popover>
              </Dropdown>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button
                    variant="bordered"
                    className="font-bold text-white border-white hover:bg-white hover:text-blue-950 transition-all duration-300 hover:scale-105"
                  >
                    Sign In
                  </Button>
                </Link>

                <div className="w-px h-5 bg-gray-500" />

                <Link href="/auth/signup">
                  <button
                    style={{ backgroundColor: "white", color: "#1e3a8a" }}
                    className="font-semibold text-md px-4 py-2 rounded-full transition-all duration-105 hover:scale-110 hover:bg-gray-100"
                  >
                    Sign Up
                  </button>
                </Link>
              </>
            )}

            <ThemeToggle />
          </div>

          {/* Mobile Toggle Button */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden text-white px-4"
          >
            <Icon data={open ? Xmark : Bars} size={22} />
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="lg:hidden w-full bg-[#0B1F3A] border-t border-blue-900 shadow-xl">
            <div className="flex flex-col p-4 gap-2">

              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 text-white px-4 py-3 rounded-xl hover:bg-white hover:text-blue-950 transition-all duration-300"
                >
                  <Icon data={item.icon} size={18} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}

              {user && (
                <>
                  <div className="border-t border-blue-900 my-2" />

                  <Link
                    href={
                      user?.role === "doctor"
                        ? "/dashboard/doctor/overview"
                        : user?.role === "admin"
                          ? "/dashboard/admin/overview"
                          : "/dashboard/patient/overview"
                    }
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 text-white px-4 py-3 rounded-xl hover:bg-white hover:text-blue-950 transition-all duration-300"
                  >
                    <PersonFill />
                    Dashboard
                  </Link>
                </>
              )}

              {/* Theme Toggle mobile */}
              <div className="px-4 py-2">
                <ThemeToggle />
              </div>

              <div className="border-t border-blue-900 my-2" />

              {user ? (
                <button
                  onClick={handleSignout}
                  className="w-full bg-red-600 text-white font-semibold h-12 rounded-xl"
                >
                  Sign Out
                </button>
              ) : (
                <>
                  <Link href="/auth/signin" onClick={() => setOpen(false)}>
                    <button className="w-full border border-white text-white h-12 font-semibold rounded-xl hover:bg-white hover:text-blue-950 transition-all">
                      Sign In
                    </button>
                  </Link>

                  <Link href="/auth/signup">
                    <Button className={`font-bold transition-all duration-300 hover:scale-110 bg-white text-blue-950 hover:bg-gray-100`}>
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}