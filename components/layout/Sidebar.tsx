"use client";

import { useTranslatedText } from "@/domain/translation/presentation/getTranslatedText";
import axios from "axios";
import { LogOut, Settings, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import router from "next/router";

interface SidebarProps {
  isOpen: boolean;
  closeMenu: () => void;
  userRole?: string;
}

const roleBasePaths: Record<string, string> = {
  PCO: "/dashboard/personnel/PCO",
  Wellness: "/dashboard/personnel/Wellness",
  IOCR: "/dashboard/personnel/IOCR",
  Settlement: "/dashboard/personnel/Settlement",
  Psychosocial: "/dashboard/personnel/Psychosocial",
  Youth: "/dashboard/personnel/Youth",
  SALP: "/dashboard/personnel/SALP",
  GBV: "/dashboard/personnel/GBV",
  Training: "/dashboard/personnel/Training",
  Policy: "/dashboard/personnel/Policy",
  Receptionist: "/dashboard/receptionist",
  Admin: "/dashboard/admin",
  "Personnel Admin": "/dashboard/PersonnelAdmin",
};
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const personnelNavItems = [
  { href: "/", label: "Dashboard" },
  { href: "/schedule", label: "Schedule" },
  { href: "/schedule/exeption", label: "Schedule exeption" },
  { href: "/clients", label: "Clients" },
  { href: "/my-client-history", label: "My Client History" },
  { href: "/assessment-history", label: "Assessment History" },
];

const personnelAdminNavItems = [
  { href: "/", label: "Dashboard" },
  { href: "/schedule", label: "Schedule" },
  { href: "/schedule/exeption", label: "Schedule exeption" },
  { href: "/clients", label: "Clients" },
  { href: "/my-client-history", label: "My Client History" },
  { href: "/assessment-history", label: "Assessment History" },
];

const receptionistNavItems = [
  { href: "/", label: "Dashboard" },
  { href: "/clients", label: "Clients" },
  { href: "/register-clients", label: "Register Clients" },
  { href: "/booked-appointment", label: "Booked Appointment" },
];

const adminNavItems = [
  { href: "/", label: "Dashboard" },
  { href: "/exeptions", label: "Exceptions" },
];

const defaultNavItems = [
  { href: "/dashboard", label: "Dashboard" },
];

export default function Sidebar({ isOpen, closeMenu, userRole }: SidebarProps) {
  const pathname = usePathname();
  const translatedText = useTranslatedText();
  const { data: session } = useSession();

  const getNavItems = () => {
    if (!userRole) return defaultNavItems;

    const basePath = roleBasePaths[userRole];

    if (!basePath) return defaultNavItems;

    const isPersonnelRole = userRole !== "Receptionist" && userRole in roleBasePaths;

    if (userRole === "Personnel Admin") {
      return personnelAdminNavItems.map(item => ({
        ...item,
        href: `${basePath}${item.href}`
      }));
    }

    if (userRole === "Admin") {
      return adminNavItems.map(item => ({
        ...item,
        href: `${basePath}${item.href}`
      }));
    }

    if (isPersonnelRole) {
      return personnelNavItems.map(item => ({
        ...item,
        href: `${basePath}${item.href}`
      }));
    }

    if (userRole === "Receptionist") {
      return receptionistNavItems.map(item => ({
        ...item,
        href: `${basePath}${item.href}`
      }));
    }

    return defaultNavItems.map(item => ({
      ...item,
      href: `${basePath}${item.href}`
    }));
  };
  const navItems = getNavItems();

  const handleLogout = async () => {

    console.log("logout")

    if (!session?.user?.accessToken) {
      console.error("No access token available");
      await signOut({ redirect: false });
      router.push('/signin');
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/auth/logout`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.user.accessToken}`,
          },
        }
      );

      console.log("Logout API response:", response.data);
      await signOut({ redirect: false });
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
      window.location.href = '/';
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data);
        console.error('Status code:', error.response?.status);

        if (error.response?.status === 403 || error.response?.status === 401) {
          console.log("Proceeding with client-side logout despite API failure");
          await signOut({ redirect: false });
          router.push('/');
          return;
        }
      }

      alert('Logout failed. Please try again.');
    }
  };
  const handleSettings = () => {
    console.log("Navigating to settings...");
    closeMenu();
  };

  return (
    <>
      <div
        className={`
  fixed top-0 left-0 left-nav overflow-hidden border-r bg-white border-gray-300 p-4
  w-50
  transform
  h-[calc(100vh-58px)]
  transition-transform duration-300 ease-in-out
  md:sticky md:top-[58px] md:translate-x-0 md:w-[296px]   
  ${isOpen ? "translate-x-0" : "-translate-x-full"}
  z-40
  flex flex-col
`}
      >
        <div className="md:hidden flex justify-between items-center">
          <div className="text-xl font-bold mb-4 select-none cursor-default">
            {translatedText?.sidebarLogoText || "HabariDoc"}
          </div>

          <button
            className=" self-end mb-4 p-1 rounded-md hover:bg-gray-200 cursor-pointer"
            onClick={closeMenu}
            aria-label={
              translatedText?.sidebarCloseButtonLabel || "Close sidebar"
            }
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex flex-col space-y-2 flex-grow">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap px-3 py-2 rounded text-[#555555] text-base hover:bg-blue-700 hover:text-white ${pathname === item.href
                ? "bg-blue-600 font-medium text-white "
                : ""
                }`}
              onClick={closeMenu}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-4 border-t border-gray-200">
          <button
            onClick={handleSettings}
            className="flex items-center gap-3 w-full whitespace-nowrap px-3 py-2 rounded text-[#555555] text-base hover:bg-gray-100 transition-colors"
          >
            <Settings size={18} />
            Settings
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full whitespace-nowrap px-3 py-2 rounded text-red-600 text-base hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-30 md:hidden"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
    </>
  );
}