"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface ProfilePicProps {
  size?: number; // default 50
}

const ProfilePic = ({ size = 50 }: ProfilePicProps) => {
  const { data: session } = useSession();
  const [src, setSrc] = useState<string>("/user.png"); // default fallback

  useEffect(() => {
    if (!session?.accessToken) return;

    const fetchProfilePic = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SPRING_BASE_URL}/user/profile-pic`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );

        console.log("Fetch profile pic", res);

        if (!res.ok) throw new Error("No profile pic");

        const blob = await res.blob();

        console.log("Blob", blob);

        if (!blob.size) throw new Error("Empty image");

        setSrc(URL.createObjectURL(blob));
      } catch (error) {
        console.log(error);
        setSrc("/user.png"); // fallback
      }
    };

    fetchProfilePic();
  }, [session]);

  return (
    <Image
      src={src}
      alt="avatar"
      width={size}
      height={size}
      className="rounded-full object-cover"
      priority
      onError={(e) => {
        const target = e.currentTarget as HTMLImageElement;
        target.src = "/user.png";
      }}
    />
  );
};

export default ProfilePic;
