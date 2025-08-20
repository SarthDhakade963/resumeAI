"use client";

const EducationForm = dynamic(() => import("@/components/Education"), {
  ssr: false, // optional: disable SSR if needed
});

import dynamic from "next/dynamic";
import React from "react";

const Education = () => {
  return <EducationForm />;
};

export default Education;
