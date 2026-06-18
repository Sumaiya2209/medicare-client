"use client";

import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import Image from "next/image";
import Logo from "@/images/medicare_logo.png";

import { Icon } from "@gravity-ui/uikit";
import {
  Handset,
  Envelope,
  MapPin,
  HeartPulse,
} from "@gravity-ui/icons";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Find Doctors", href: "/doctors" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0B1F3A] text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14">

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 ">

          {/* Logo + About */}
          <div>
            <Link href="/" className="flex items-center gap-3">
              <Image
                src={Logo}
                alt="MediCare Connect"
                width={250}
                height={100}
              />
            </Link>

            <p className="mt-4 text-sm text-gray-300 leading-6">
              MediCare Connect is your trusted healthcare platform for booking
              appointments, managing records, and accessing medical services.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-5">
              <Link
                href="https://facebook.com"
                target="_blank"
                className="p-2 rounded-full border border-white/20 hover:bg-white hover:text-[#0B1F3A] transition-all duration-300"
              >
                <FaFacebookF size={16} />
              </Link>

              <Link
                href="https://instagram.com"
                target="_blank"
                className="p-2 rounded-full border border-white/20 hover:bg-white hover:text-[#0B1F3A] transition-all duration-300"
              >
                <FaInstagram size={16} />
              </Link>

              <Link
                href="https://twitter.com"
                target="_blank"
                className="p-2 rounded-full border border-white/20 hover:bg-white hover:text-[#0B1F3A] transition-all duration-300"
              >
                <FaTwitter size={16} />
              </Link>

              <Link
                href="https://youtube.com"
                target="_blank"
                className="p-2 rounded-full border border-white/20 hover:bg-white hover:text-[#0B1F3A] transition-all duration-300"
              >
                <FaYoutube size={16} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:mt-6 text-center">
            <h3 className="text-lg font-semibold mb-4 text-blue-400">Quick Links</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="hover:text-white transition">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:mt-6 text-center">
            <h3 className="text-lg font-semibold mb-4 text-blue-400">Contact</h3>

            <div className="space-y-4 text-sm text-gray-300">
              <div className="flex items-center justify-center gap-2">
                <Icon data={MapPin} size={16} />
                <span>Dhaka, Bangladesh</span>
              </div>

              <div className="flex items-center justify-center gap-2">
                <Icon data={Envelope} size={16} />
                <span>support@medicareconnect.com</span>
              </div>

              <div className="flex items-center justify-center gap-2">
                <Icon data={Handset} size={16} />
                <span>+880 1234 567 890</span>
              </div>
            </div>
          </div>

          {/* Emergency */}
          <div className="bg-red-600/10 border max-h-40 lg:mt-6 border-red-500/30 rounded-lg p-5 text-center">
            <div className="flex items-center justify-center gap-2 text-red-400 font-semibold">
              <Icon data={HeartPulse} size={18} />
              Emergency Hotline
            </div>

            <p className="mt-3 text-2xl font-bold">999</p>

            <p className="text-sm text-gray-300 mt-2">
              24/7 emergency medical support available
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} MediCare Connect. All rights reserved.</p>

          <div className="flex gap-6 mt-3 md:mt-0">
            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}