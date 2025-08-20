"use client";

import { Loader } from "lucide-react";

export default function LoadingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 max-w-sm w-full">
        <div className="text-center">
          {/* Loader Icon */}
          <div className="w-12 h-12 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Loader className="w-6 h-6 text-gray-600 animate-spin" />
          </div>

          {/* Title */}
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            Please wait
          </h2>

          {/* Subtitle */}
          <p className="text-gray-600 text-sm">
            We’re processing your request...
          </p>
        </div>
      </div>
    </div>
  );
}
