"use client";
import { useState } from "react";
import {
  FolderOpen,
  FileText,
  Github,
  Plus,
  X,
  Save,
  ExternalLink,
} from "lucide-react";
import { fetchWithToken } from "@/lib/fetchWithToken";
import { useRouter } from "next/navigation";

interface Project {
  projectName: string;
  description: string;
  url: string;
}

export default function ProjectsForm() {
  const [projects, setProjects] = useState<Project[]>([
    {
      projectName: "",
      description: "",
      url: "",
    },
  ]);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    projects.forEach((project, index) => {
      if (!project.projectName.trim()) {
        newErrors[`projectName-${index}`] = "Project name is required";
      }
      if (!project.description.trim()) {
        newErrors[`description-${index}`] = "Description is required";
      }
      if (!project.url.trim()) {
        newErrors[`url-${index}`] = "GitHub repository URL is required";
      } else if (!isValidGitHubUrl(project.url)) {
        newErrors[`url-${index}`] =
          "Please enter a valid GitHub repository URL (e.g., https://github.com/username/repo)";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidGitHubUrl = (url: string) => {
    const githubUrlPattern =
      /^https:\/\/(www\.)?github\.com\/[\w\-_.]+\/[\w\-_.]+\/?$/;
    return githubUrlPattern.test(url);
  };

  const handleChange = (index: number, field: keyof Project, value: string) => {
    const updatedProjects = [...projects];
    updatedProjects[index][field] = value;
    setProjects(updatedProjects);

    // Clear error when user starts typing
    const errorKey = `${field}-${index}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: "" }));
    }
  };

  const addProject = () => {
    setProjects([
      ...projects,
      {
        projectName: "",
        description: "",
        url: "",
      },
    ]);
  };

  const removeProject = (index: number) => {
    if (projects.length > 1) {
      const updatedProjects = projects.filter((_, i) => i !== index);
      setProjects(updatedProjects);

      // Clear errors for removed project
      const newErrors = { ...errors };
      Object.keys(newErrors).forEach((key) => {
        if (key.endsWith(`-${index}`)) {
          delete newErrors[key];
        }
      });
      setErrors(newErrors);
    }
  };

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Filter out incomplete projects
    const validProjects = projects.filter(
      (project) =>
        project.projectName.trim() &&
        project.description.trim() &&
        project.url.trim() &&
        isValidGitHubUrl(project.url)
    );

    if (validProjects.length === 0) {
      setErrors({ general: "Please add at least one complete project entry" });
      return;
    }

    try {
      const res = await fetchWithToken("/user/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validProjects),
      });

      if (!res.ok) {
        setErrors({ general: "Failed to save projects" });
        return;
      }

      router.push("/user/edu");
    } catch (error) {
      console.error(error);
      setErrors({ general: "Failed to save projects" });
    }
  };

  const inputClasses = (fieldName: string) =>
    `w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 ${
      errors[fieldName]
        ? "border-red-300 bg-red-50"
        : "border-gray-300 hover:border-gray-400 focus:border-gray-500"
    }`;

  const textareaClasses = (fieldName: string) =>
    `w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 resize-none ${
      errors[fieldName]
        ? "border-red-300 bg-red-50"
        : "border-gray-300 hover:border-gray-400 focus:border-gray-500"
    }`;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-500 to-gray-800 rounded-t-xl p-6">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-3 rounded-lg">
            <FolderOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Add Projects</h2>
            <p className="text-gray-200 text-sm">
              Enter your project details with GitHub repositories
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Projects List */}
        <div className="space-y-6">
          {projects.map((project, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-6 bg-gray-50"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-700 flex items-center space-x-2">
                  <FolderOpen className="w-5 h-5" />
                  <span>Project {index + 1}</span>
                </h3>
                {projects.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeProject(index)}
                    className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {/* Project Name */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                    <FolderOpen className="w-4 h-4" />
                    <span>Project Name *</span>
                  </label>
                  <input
                    placeholder="e.g., E-commerce Website, Task Manager App, ML Classifier"
                    value={project.projectName}
                    onChange={(e) =>
                      handleChange(index, "projectName", e.target.value)
                    }
                    className={inputClasses(`projectName-${index}`)}
                  />
                  {errors[`projectName-${index}`] && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors[`projectName-${index}`]}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                    <FileText className="w-4 h-4" />
                    <span>Description *</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe your project, technologies used, key features, and your role in the project..."
                    value={project.description}
                    onChange={(e) =>
                      handleChange(index, "description", e.target.value)
                    }
                    className={textareaClasses(`description-${index}`)}
                  />
                  {errors[`description-${index}`] && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors[`description-${index}`]}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Include technologies used, key features, and your
                    contributions
                  </p>
                </div>

                {/* GitHub URL */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                    <Github className="w-4 h-4" />
                    <span>GitHub Repository URL *</span>
                  </label>
                  <div className="relative">
                    <input
                      placeholder="https://github.com/username/repository-name"
                      value={project.url}
                      onChange={(e) =>
                        handleChange(index, "url", e.target.value)
                      }
                      className={inputClasses(`url-${index}`)}
                    />
                    {project.url && isValidGitHubUrl(project.url) && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  {errors[`url-${index}`] && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors[`url-${index}`]}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Must be a valid GitHub repository URL (e.g.,
                    https://github.com/username/repo)
                  </p>
                </div>

                {/* URL Preview */}
                {project.url && isValidGitHubUrl(project.url) && (
                  <div className="p-4 bg-white rounded-lg border border-green-200">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-green-100">
                        <Github className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-800">
                          Valid GitHub Repository
                        </p>
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-green-600 hover:text-green-800 underline flex items-center space-x-1"
                        >
                          <span>{project.url}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add More Projects Button */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={addProject}
            className="flex items-center space-x-2 px-6 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors text-gray-600 hover:text-gray-700"
          >
            <Plus className="w-5 h-5" />
            <span>Add Another Project</span>
          </button>
        </div>

        {/* GitHub URL Format Guide */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center space-x-2">
            <Github className="w-4 h-4" />
            <span>GitHub URL Format Guide</span>
          </h4>
          <div className="text-sm text-blue-700">
            <p className="mb-2">
              ✅ <strong>Correct format:</strong>{" "}
              https://github.com/username/repository-name
            </p>
            <p className="mb-1">
              ❌ <strong>Incorrect:</strong> github.com/username/repo (missing
              https://)
            </p>
            <p>
              ❌ <strong>Incorrect:</strong> https://github.com/username
              (missing repository name)
            </p>
          </div>
        </div>

        {/* General Error */}
        {errors.general && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{errors.general}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-900 hover:to-gray-800 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 shadow-lg flex items-center justify-center space-x-2"
          >
            <Save className="w-5 h-5" />
            <span>Save All Projects</span>
          </button>
        </div>
      </div>
    </div>
  );
}
