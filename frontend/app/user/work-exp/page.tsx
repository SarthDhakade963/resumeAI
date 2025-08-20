"use client";

const WorkExperienceForm = dynamic(
  () => import("@/components/WorkExperience"),
  {
    ssr: false, // optional: disable SSR if needed
  }
);

import dynamic from "next/dynamic";
import React from "react";

const WorkExperience = () => {
  return <WorkExperienceForm />;
};

export default WorkExperience;
