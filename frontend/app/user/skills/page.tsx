"use client";

const SkillsForm = dynamic(() => import("@/components/Skills"), {
  ssr: false, // optional: disable SSR if needed
});

import dynamic from "next/dynamic";
import React from "react";

const Skills = () => {
  return <SkillsForm />;
};

export default Skills;
