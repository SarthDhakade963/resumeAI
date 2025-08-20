// components/SidebarWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import Sidebar from "./Sidebar";

interface SidebarWrapperProps {
  children: React.ReactNode;
}

export default function SidebarWrapper({ children }: SidebarWrapperProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const isDashboard = pathname.startsWith("/dashboard");
  const isUserPage = pathname.startsWith("/user");
  const showSidebar = isDashboard || isUserPage;

  if (!showSidebar) {
    // For pages that don't need sidebar (home, auth, etc.)
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <main 
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? 'ml-72' : 'ml-20'
        }`}
      >
        {children}
      </main>
    </div>
  );
}