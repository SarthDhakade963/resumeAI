"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    // Put any navigation logic here — *after* the component mounts
    const shouldRedirect = true; // your condition

    if (shouldRedirect) {
      router.push("/home");
    }
  }, [router]);
  
}


