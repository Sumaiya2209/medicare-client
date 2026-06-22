"use client";

import { Bars, Bell, Envelope, Gear, House, LayoutSideContentLeft, Magnifier, Person } from "@gravity-ui/icons";
import { Button, Drawer } from "@heroui/react";
import { useSession, signOut } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function DashBoardSideBar() {
  const { data } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const user = data?.user;
  const name = user?.name || "User";
  const role = user?.role || "patient";
  const imageUrl = user?.image || "https://via.placeholder.com/150";

  const navItems = [
    { icon: House, label: "Overview", href: "/dashboard/patient/overview" },

    ...(role === "patient"
      ? [
          { icon: Magnifier, label: "My Appointments", href: "/dashboard/patient/appointment" },
          { icon: Bell, label: "Payment History", href: "/dashboard/patient/payment" },
        ]
      : []),

    ...(role === "doctor"
      ? [
          { icon: Bell, label: "Manage Schedule", href: "/dashboard/doctor/schedule" },
          { icon: Envelope, label: "Appointment Requests", href: "/dashboard/doctor/requests" },
        ]
      : []),

    { icon: Envelope, label: "My Reviews", href: "/dashboard/patient/reviews" },
    { icon: Person, label: "Profile", href: "/dashboard/profile" },
  ];

  const handleSignout = async () => {
    await signOut();
    router.push("/");
  };

  const navContent = (
    <div className="flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-4 mb-6 border rounded-2xl shadow-xl p-4">
          <Image
            src={imageUrl}
            alt="Profile Picture"
            width={64}
            height={64}
            className="h-16 w-16 rounded-full object-cover ring-2 ring-blue-900"
          />

          <div className="ml-3 ">
            <h2 className="text-lg font-bold ">{name}</h2>
            <p className="text-sm text-zinc-400">Welcome back</p>
            <span className="mt-2 inline-flex rounded-full bg-blue-950 px-3 py-1 text-xs font-medium text-blue-100 capitalize">
              {role}
            </span>
          </div>
        </div>

        {/* Top Button */}
        <Link
          href="/bookappointment"
          className="mb-6 w-full bg-blue-950 text-white hover:bg-blue-950 p-6 font-bold rounded-2xl block text-center"
        >
          + Book Appointment
        </Link>

        {/* Menu */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all
                  ${isActive
                    ? "bg-blue-950 text-white"
                    : "text-gray-800 hover:bg-blue-950 hover:text-white"
                  }
                `}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-zinc-800 pt-4 mt-50">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-800 hover:bg-blue-950 hover:text-white"
        >
          <Gear className="h-5 w-5" />
          Settings
        </button>

        <button
          onClick={handleSignout}
          type="button"
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-800 hover:bg-blue-950 hover:text-white"
        >
          <LayoutSideContentLeft className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden w-90 sticky top-0 border-r border-default p-4 lg:block">
        {navContent}
      </aside>
      <Drawer>
        <Drawer.Trigger className="lg:hidden flex items-start justify-center m-3" type="button">
          <LayoutSideContentLeft />
          Sidebar
        </Drawer.Trigger>
        <Drawer.Backdrop>
          <Drawer.Content placement="left">
            <Drawer.Dialog>
              <Drawer.CloseTrigger />
              <Drawer.Header>
                <Drawer.Heading>Navigation</Drawer.Heading>
              </Drawer.Header>
              <Drawer.Body>{navContent}</Drawer.Body>
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer.Backdrop>
      </Drawer>
    </>
  );
}