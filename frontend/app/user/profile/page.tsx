"use client";
const Profile = dynamic(() => import("@/components/Profile"), {
  ssr: false,
});

import React from "react";
import dynamic from "next/dynamic";

const page = () => {
  return <Profile />;
};

export default page;
