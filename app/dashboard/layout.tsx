"use client";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { ToastContainer } from "react-toastify";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen((v) => !v);
  const closeMenu = () => setIsOpen(false);
   const { data: session } = useSession();
  const userRole = session?.user?.role as string | undefined;

  return (
    <div className="flex-1  flex flex-col bg-[#F5F6FA] min-h-screen">
      <Topbar isOpen={isOpen} toggleMenu={toggleMenu} />
      <div className="flex flex-1 ">
        {/* Sidebar - hidden on mobile by default, shown when isOpen is true */}
        <Sidebar isOpen={isOpen} closeMenu={closeMenu} userRole={userRole} />        
        {/* Main content */}
        <main className="flex-1 p-2 overflow-hidden  text-black">
          {children}
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}