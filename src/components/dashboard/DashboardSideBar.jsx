'use client'

import { Bars, Bell, Envelope, Gear, House, LayoutSideContentLeft, Magnifier, Person } from "@gravity-ui/icons";
import { Button, Drawer } from "@heroui/react";
import Navbar from "../Home/Navbar";
import { useSession } from "@/lib/auth-client";
import Image from "next/image";

export function DashBoardSideBar() {
  const navItems = [
    { icon: House, label: "Overview", active: true },
    { icon: Magnifier, label: "My Appointments" },
    { icon: Bell, label: "Payment History" },
    { icon: Envelope, label: "My Reviews" },
    { icon: Person, label: "Profile" },
  ];

  const { data } = useSession();
  const user = data?.user
  const name = user?.name || "User";
  const role = user?.role || "patient";
  const imageUrl = user?.image || "https://via.placeholder.com/150";

  const handleSignout = async () => {
    await signOut();
    router.push("/");
  }

  const navContent = (
    <div className="flex flex-col justify-between">
      <div >
        <div className="flex items-center my-2 gap-4">
          <div>
            <Image src={imageUrl} alt="Profile Picture" width={100}
            height={100} className="w-16 h-16 rounded-full mb-4" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">{name}</h2>
          <p className="text-sm text-white p-1 w-15 text-center rounded-full bg-blue-950 ">{role}</p>
          </div>
        </div>

        {/* Top Button */}
        <Button className="mb-6 w-full bg-blue-950 text-white hover:bg-blue-950 p-6 font-bold rounded-2xl">
          + Book Appointment
        </Button>

        {/* Menu */}
        <nav className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all
              
              ${item.active
                  ? "bg-blue-950 text-white"
                  : "text-gray-800 hover:bg-blue-950 hover:text-white"
                }
            `}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
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
              <Drawer.Body>
                {navContent}
              </Drawer.Body>
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer.Backdrop>
      </Drawer>
    </>
  );
}