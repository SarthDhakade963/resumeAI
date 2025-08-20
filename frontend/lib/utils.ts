import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type User = {
  id: string;
  username: string | null;
  email: string | null;
  profilePicUrl: string | null;
  accessToken: string;
  isProfileComplete: boolean;
};

export function useAuthRedirect() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const checkAuthAndRedirect = async () => {
      try {
        // 1. Check authentication status
        if (status === "unauthenticated") {
          if (pathname !== "/home") {
            router.replace("/home");
          }
          return;
        }

        if (status !== "authenticated") return;

        // 2. Fetch profile data
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SPRING_BASE_URL}/user/check-profile`,
          {
            headers: { Authorization: `Bearer ${session.accessToken}` },
            signal: controller.signal,
          }
        );

        if (!res.ok) throw new Error("Profile check failed");

        const data = await res.json();
        const profileCompleted = data.profileCompleted;

        if (!isMounted) return;

        // 4. Handle redirects
        if (profileCompleted === true) {
          console.log("Profile completed : ", profileCompleted);
          const userRes = await fetch(
            `${process.env.NEXT_PUBLIC_SPRING_BASE_URL}/user/me`,
            { headers: { Authorization: `Bearer ${session.accessToken}` } }
          );

          const fullUser = await userRes.json();

          setUser({ ...fullUser, isProfileComplete: true });

          if (!pathname.startsWith("/dashboard")) {
            console.log("Redirecting to dashboard from:", pathname);
            router.replace("/dashboard");
          }
        } else {
          if (!pathname.startsWith("/user/profile")) {
            router.replace("/user/profile");
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
        // Ignore abort errors
        if (error !== "AbortError") {
          console.error("Auth check error:", error);
          if (pathname !== "/home") router.replace("/home");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkAuthAndRedirect();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [status, session, router, pathname]);

  return { user, loading };
}
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
