"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";

export default function CheckProfile() {
  const router = useRouter();
  

  useEffect(() => {
    async function checkProfile() {
      const session = await getSession();
      console.log("Session:", session);

      if (!session?.accessToken) {
        router.push("/home");
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SPRING_BASE_URL}/auth/validate`,
          {
            method:"GET",
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) throw new Error("Unauthorized");

        const data = await res.json();

        if (!data.isProfileComplete) {
          router.push("/profile-setup");
        } else {
          router.push("/dashboard");
        }
      } catch (err) {
        console.error(err);
        router.push("/home");
      }
    }

    checkProfile();
  }, [router]);

  return <div>Checking profile…</div>;
}
