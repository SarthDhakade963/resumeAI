// app/dashboard/page.tsx
"use client";

import { signOut } from "next-auth/react";
import React, { useEffect } from "react";
import LoadingPage from "@/components/LoadingPage";
import { useAuthRedirect } from "@/lib/utils";

import dynamic from "next/dynamic";

const ProfilePic = dynamic(() => import("@/components/ProfilePic"), {
  ssr: false,
});

const Dashboard = () => {
  const { user, loading } = useAuthRedirect();

  useEffect(() => {
    console.log("Dashboard render - loading:", loading, "user:", user);
  }, [loading, user]);

  const handleGenerateResume = () => {
    // Add your resume generation logic here
    console.log("Generating resume...");
    // You could navigate to a resume generation page or trigger a modal
    // router.push('/generate-resume');

    
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back!</h1>
          <p className="text-gray-600 mt-1">Here&apos;s what&apos;s happening with your account</p>
        </div>
        
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-medium">{user?.username}</span>
            <ProfilePic />
            <button
              onClick={() => signOut({ callbackUrl: "/home" })}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Sign out
            </button>
          </div>
        )}
      </header>

      {/* Dashboard Content */}
      <div className="p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Profile Completion</p>
                <p className="text-2xl font-bold text-gray-900">85%</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Projects</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Skills</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Generate Resume Button - Prominent placement */}
        <div className="mb-8 flex justify-center items-center">
          <button
            onClick={handleGenerateResume}
            className="w-full  md:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <div className="flex items-center justify-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Generate Resume
            </div>
          </button>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <p className="text-gray-700">Updated profile information</p>
                <span className="text-gray-500 text-sm ml-auto">2 hours ago</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-gray-700">Added new project</p>
                <span className="text-gray-500 text-sm ml-auto">1 day ago</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <p className="text-gray-700">Updated skills section</p>
                <span className="text-gray-500 text-sm ml-auto">3 days ago</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <div className="text-sm font-medium text-gray-900">Edit Profile</div>
                <div className="text-xs text-gray-600">Update your information</div>
              </button>
              <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <div className="text-sm font-medium text-gray-900">Add Project</div>
                <div className="text-xs text-gray-600">Showcase your work</div>
              </button>
              <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <div className="text-sm font-medium text-gray-900">Update Skills</div>
                <div className="text-xs text-gray-600">Add new abilities</div>
              </button>
              <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <div className="text-sm font-medium text-gray-900">View Analytics</div>
                <div className="text-xs text-gray-600">Check your stats</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;