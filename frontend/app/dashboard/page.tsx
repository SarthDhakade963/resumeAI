"use client";

import { getSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";

interface UserResponse {
  username: string;
  email: string;
  profilePic: string | null; // Matches backend response
}

const Dashboard = () => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<string>("");

  useEffect(() => {
    if (user?.profilePic) {
      const url = user.profilePic.startsWith("http")
        ? user.profilePic
        : `${process.env.NEXT_PUBLIC_SPRING_BASE_URL}${user.profilePic}`;
      setPreview(url);
    }
  }, [user]);

  useEffect(() => {
    const checkout = async () => {
      const session = await getSession();

      if (!session || !("accessToken" in session) || !session.accessToken) {
        router.push("/home");
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SPRING_BASE_URL}/auth/valid`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );

        if (res.status === 403) {
          router.push("/profile-setup");
          return;
        }

        if (!res.ok) {
          router.push("/home");
          return;
        }

        const data: UserResponse = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
        router.push("/home");
      } finally {
        setLoading(false);
      }
    };

    checkout();
  }, [router]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-24">
      <header className="flex justify-end items-center gap-12">
        {user && (
          <>
            <span>{user.username || user.email}</span>
            {preview && (
              <Image
                src={preview}
                alt="avatar"
                width={50}
                height={50}
                className="rounded-full object-cover"
              />
            )}
            <button onClick={() => signOut({ callbackUrl: "/home" })}>
              Sign out
            </button>
          </>
        )}
      </header>

      <main>
        <h1>Dashboard</h1>
        <p>Protected content here.</p>
      </main>
    </div>
  );
};

export default Dashboard;
