"use client";

import LoadingPage from "@/components/LoadingPage";
import { useAuthRedirect } from "@/lib/utils";
import { Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";

const AuthButton = dynamic(() => import("@/components/AuthButton"), {
  loading: () => <Loader className="w-6 h-6 text-gray-800 animate-spin" />, // optional loader
  ssr: false, // optional: disable SSR if needed
});

export default function Home() {
  const { status } = useSession();
  const { user, loading } = useAuthRedirect(); // centralized hook

  // While auth/profile data is loading, show loading page
  if (status === "loading" || loading) return <LoadingPage />;

  // User is logged in and profile complete → redirect
  if (user && user.isProfileComplete) {
    console.log(user.isProfileComplete);
    if (typeof window !== "undefined") {
      window.location.replace("/dashboard");
    }
    return null; // don't render anything
  }

  // User is logged in but profile incomplete → redirect to profile setup
  if (user && !user.isProfileComplete) {
    console.log(user.isProfileComplete);
    if (typeof window !== "undefined") {
      window.location.replace("/user/profile");
    }
    return null;
  }

  return (
    <main className="h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold mb-4">
        AI Resume & Cover Letter Generator
      </h1>
      <p className="mb-6">
        Enter your details, and get a professional resume + cover letter with
        AI.
      </p>
      <AuthButton />
    </main>
  );
}
