"use client";

const ProjectsForm = dynamic(() => import("@/components/Projects"), {
  ssr: false, // optional: disable SSR if needed
});

import dynamic from "next/dynamic";
import React from "react";

const Projects = () => {
  return <ProjectsForm />;
};

export default Projects;
