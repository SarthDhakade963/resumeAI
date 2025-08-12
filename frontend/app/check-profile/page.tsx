"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import { Loader } from "lucide-react";

export default function CheckProfile() {
  const router = useRouter();
  const [status, setStatus] = useState("Checking profile...");

  useEffect(() => {
    async function checkProfile() {
      try {
        setStatus("Verifying session...");
        const session = await getSession();
        console.log("Session:", session);

        if (!session?.accessToken) {
          setStatus("Redirecting...");
          router.push("/home");
          return;
        }

        setStatus("Validating credentials...");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SPRING_BASE_URL}/auth/validate`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) throw new Error("Unauthorized");

        const data = await res.json();

        if (!data.isProfileComplete) {
          setStatus("Redirecting to profile setup...");
          router.push("/profile-setup");
        } else {
          setStatus("Redirecting to dashboard...");
          router.push("/dashboard");
        }
      } catch (err) {
        console.error(err);
        setStatus("Authentication failed. Redirecting...");
        router.push("/home");
      }
    }

    checkProfile();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-sm w-full">
        <div className="text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Loader className="w-6 h-6 text-gray-600 animate-spin" />
          </div>
          
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Please wait
          </h2>
          
          <p className="text-gray-600 text-sm">
            {status}
          </p>
        </div>
      </div>
    </div>
  );
}