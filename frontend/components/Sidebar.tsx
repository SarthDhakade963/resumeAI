// components/Sidebar.tsx (Updated)
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  User,
  Award,
  Briefcase,
  GraduationCap,
  Building2,
  BarChart3,
  Settings,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useSession } from "next-auth/react";
import ProfilePic from "@/components/ProfilePic";

const pages = [
  { path: "/user/profile", label: "Profile", icon: User },
  { path: "/user/skills", label: "Skills", icon: Award },
  { path: "/user/projects", label: "Projects", icon: Briefcase },
  { path: "/user/edu", label: "Education", icon: GraduationCap },
  { path: "/user/work-exp", label: "Work Experience", icon: Building2 },
];

const dashboardItems = [
  { path: "/dashboard", label: "Overview", icon: Eye },
  { path: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/dashboard/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const session = useSession();
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  // Find current page index for profile flow
  const currentPageIndex = pages.findIndex((p) => p.path === pathname);
  const totalPages = pages.length;
  const progress =
    currentPageIndex >= 0 ? ((currentPageIndex + 1) / totalPages) * 100 : 0;

  const sidebarWidth = isOpen ? "w-72" : "w-20";

  return (
    <aside
      className={`fixed left-0 top-0 h-full ${sidebarWidth} 
      bg-gradient-to-b z-50 ${
        isDashboard
          ? "from-gray-900 via-gray-800 to-gray-900 text-white"
          : "from-gray-50 to-gray-100 border-r border-gray-200"
      } 
      flex flex-col shadow-xl transition-all duration-300 ease-in-out`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-3 top-6 bg-gray-800 text-white rounded-full p-1 shadow-lg hover:bg-gray-700 transition z-10"
      >
        {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>

      {/* Header */}
      <div
        className={`p-6 border-b ${
          isDashboard ? "border-gray-700/50" : "border-gray-200"
        } flex items-center space-x-3`}
      >
        <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center flex-shrink-0">
          {isDashboard ? (
            <BarChart3 className="w-5 h-5 text-gray-200" />
          ) : (
            <ProfilePic />
          )}
        </div>
        {isOpen && (
          <div className="min-w-0">
            <h1
              className={`text-xl font-bold truncate ${
                isDashboard ? "text-gray-100" : "text-gray-800"
              }`}
            >
              {isDashboard
                ? "Dashboard"
                : session.data?.user?.name || "Username"}
            </h1>
            <p
              className={`text-xs ${
                isDashboard ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {isDashboard ? "Control Center" : "Profile Setup"}
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {(isDashboard ? dashboardItems : pages).map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center ${isOpen ? 'space-x-3' : 'justify-center'} p-3 rounded-xl transition-all duration-200 group
                  ${
                    isActive
                      ? isDashboard
                        ? "bg-gray-700/50 text-white"
                        : "bg-white shadow-md border border-gray-200 text-gray-800"
                      : isDashboard
                      ? "hover:bg-gray-700/40 text-gray-300 hover:text-white"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  }`}
                >
                  {isOpen ? (
                    <>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors flex-shrink-0 ${
                        isDashboard
                          ? isActive
                            ? "bg-gray-600"
                            : "bg-gray-700/50 group-hover:bg-gray-600"
                          : "bg-gray-200 group-hover:bg-gray-300"
                      }`}>
                        <Icon
                          className={`w-4 h-4 ${
                            isDashboard
                              ? "text-gray-200"
                              : isActive
                              ? "text-gray-700"
                              : "text-gray-400 group-hover:text-gray-600"
                          }`}
                        />
                      </div>
                      <span
                        className={`font-medium truncate ${
                          isDashboard
                            ? "text-gray-200 group-hover:text-white"
                            : "text-gray-700"
                        }`}
                      >
                        {item.label}
                      </span>
                    </>
                  ) : (
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      isActive
                        ? isDashboard
                          ? "bg-gray-700/50"
                          : "bg-white shadow-md border border-gray-200"
                        : isDashboard
                        ? "group-hover:bg-gray-700/40"
                        : "group-hover:bg-gray-50"
                    }`}>
                      <Icon
                        className={`w-5 h-5 ${
                          isDashboard
                            ? isActive
                              ? "text-white"
                              : "text-gray-300 group-hover:text-white"
                            : isActive
                            ? "text-gray-700"
                            : "text-gray-400 group-hover:text-gray-600"
                        }`}
                      />
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Progress (only for profile flow) */}
      {!isDashboard && isOpen && (
        <div className="p-6 bg-white border-t border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-semibold text-gray-700">Progress</p>
            <p className="text-sm font-bold text-gray-800">
              {Math.round(progress)}%
            </p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </aside>
  );
}