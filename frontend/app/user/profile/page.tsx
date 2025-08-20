"use client";
const ProfileSetup = dynamic(() => import("@/components/Profile"), {
  ssr: false,
});

import React from "react";
import dynamic from "next/dynamic";

const page = () => {
  return <ProfileSetup />;
};

export default page;
