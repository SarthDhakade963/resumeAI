// components/ProtectedLayout.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingPage from "./LoadingPage";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (status !== "authenticated") {
      router.replace("/home");
      return;
    }

    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_BASE_URL}/user/check-profile`, {
          method:"GET",
          headers: { Authorization: `Bearer ${session?.accessToken}` },
        });

        const data = await res.json();

        if (!data.profileCompleted) {
          router.replace("/user/profile"); // Profile incomplete → go to profile setup
        } else {
          router.replace("/dashboard"); // Profile complete → go to dashboard
        }
      } catch {
        router.replace("/home");
      }
    })();
  }, [status, session, router]);

  if (status === "loading") return <LoadingPage />;
  return <>{children}</>;
}