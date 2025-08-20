"use client";
import { useState, useRef, useEffect } from "react";
import {
  Code2,
  TrendingUp,
  Star,
  Target,
  Plus,
  X,
  Save,
  ChevronDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { fetchWithToken } from "@/lib/fetchWithToken";
import { useSession } from "next-auth/react";
import React from "react";

interface Skill {
  skillName: string;
  proficiency: string;
}

export default function SkillsForm() {
  const session = useSession();
  const router = useRouter();
  if (!session) {
    router.push("/home");
  }

  const [skills, setSkills] = useState<Skill[]>([
    { skillName: "", proficiency: "" },
  ]);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [suggestions, setSuggestions] = useState<{ [key: number]: string[] }>(
    {}
  );
  const [showSuggestions, setShowSuggestions] = useState<{
    [key: number]: boolean;
  }>({});
  const [activeSuggestion, setActiveSuggestion] = useState<{
    [key: number]: number;
  }>({});

  const suggestionRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // Popular skills for suggestions
  const popularSkills = [
    "JavaScript",
    "Python",
    "Java",
    "TypeScript",
    "C++",
    "C#",
    "PHP",
    "Swift",
    "Kotlin",
    "Go",
    "Rust",
    "Ruby",
    "SQL",
    "HTML",
    "CSS",
    "React",
    "Angular",
    "Vue.js",
    "Node.js",
    "Express.js",
    "Django",
    "Flask",
    "Spring Boot",
    "Laravel",
    "Ruby on Rails",
    "ASP.NET",
    "TensorFlow",
    "PyTorch",
    "Pandas",
    "NumPy",
    "SciPy",
    "Matplotlib",
    "Scikit-learn",
    "Keras",
    "Docker",
    "Kubernetes",
    "AWS",
    "Azure",
    "Google Cloud",
    "Firebase",
    "MongoDB",
    "PostgreSQL",
    "MySQL",
    "Redis",
    "GraphQL",
    "REST API",
    "Git",
    "CI/CD",
    "Agile",
    "Scrum",
    "DevOps",
    "Machine Learning",
    "Deep Learning",
    "Data Science",
    "Computer Vision",
    "NLP",
    "Cybersecurity",
    "Blockchain",
    "UI/UX Design",
    "Product Management",
    "Project Management",
    "Leadership",
    "Communication",
    "Teamwork",
    "Problem Solving",
    "Critical Thinking",
  ];

  // Add new skill form
  const addSkill = () => {
    setSkills([...skills, { skillName: "", proficiency: "" }]);
  };

  // Remove skill form
  const removeSkill = (index: number) => {
    if (skills.length > 1) {
      const updatedSkills = skills.filter((_, i) => i !== index);
      setSkills(updatedSkills);

      // Clear related states
      const newErrors = { ...errors };
      Object.keys(newErrors).forEach((key) => {
        if (key.endsWith(`-${index}`)) {
          delete newErrors[key];
        }
      });
      setErrors(newErrors);

      const newSuggestions = { ...suggestions };
      const newShowSuggestions = { ...showSuggestions };
      const newActiveSuggestion = { ...activeSuggestion };
      delete newSuggestions[index];
      delete newShowSuggestions[index];
      delete newActiveSuggestion[index];
      setSuggestions(newSuggestions);
      setShowSuggestions(newShowSuggestions);
      setActiveSuggestion(newActiveSuggestion);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    skills.forEach((skill, index) => {
      if (!skill.skillName.trim()) {
        newErrors[`skillName-${index}`] = "Skill name is required";
      }
      if (!skill.proficiency) {
        newErrors[`proficiency-${index}`] = "Proficiency level is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (index: number, field: keyof Skill, value: string) => {
    const updatedSkills = [...skills];
    updatedSkills[index] = {
      ...updatedSkills[index],
      [field]: value,
    };
    setSkills(updatedSkills);

    // Clear error when user starts typing
    const errorKey = `${field}-${index}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: "" }));
    }
  };

  // Handle skill name change with suggestions
  const handleSkillNameChange = (index: number, value: string) => {
    handleChange(index, "skillName", value);

    if (value.length > 0) {
      const filteredSuggestions = popularSkills.filter((skill) =>
        skill.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions((prev) => ({ ...prev, [index]: filteredSuggestions }));
      setShowSuggestions((prev) => ({ ...prev, [index]: true }));
      setActiveSuggestion((prev) => ({ ...prev, [index]: -1 }));
    }
  };

  // Add this separate click handler
  const handleInputClick = (index: number) => {
    const currentValue = skills[index].skillName;

    if (currentValue.length > 0) {
      // If there's text, show filtered suggestions
      const filteredSuggestions = popularSkills.filter((skill) =>
        skill.toLowerCase().includes(currentValue.toLowerCase())
      );
      setSuggestions((prev) => ({ ...prev, [index]: filteredSuggestions }));
    } else {
      // If empty, show all suggestions
      setSuggestions((prev) => ({ ...prev, [index]: [...popularSkills] }));
    }

    setShowSuggestions((prev) => ({ ...prev, [index]: true }));
  };

  // Handle suggestion click
  const handleSuggestionClick = (index: number, skill: string) => {
    const newSkills = skills.map((s, i) =>
      i === index ? { ...s, skillName: skill } : s
    );

    setSkills(newSkills);
    setShowSuggestions((prev) => ({ ...prev, [index]: false }));
    setActiveSuggestion((prev) => ({ ...prev, [index]: -1 }));

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`skillName-${index}`];
      return newErrors;
    });

    // Focus back on the input after selection
    const inputElement = document.getElementById(`institution-input-${index}`);
    if (inputElement) {
      inputElement.focus();
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    const currentSuggestions = suggestions[index] || [];
    const currentActive = activeSuggestion[index] ?? -1;

    if (!showSuggestions[index] || currentSuggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveSuggestion((prev) => ({
          ...prev,
          [index]: (currentActive + 1) % currentSuggestions.length,
        }));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveSuggestion((prev) => ({
          ...prev,
          [index]:
            (currentActive - 1 + currentSuggestions.length) %
            currentSuggestions.length,
        }));
        break;
      case "Enter":
        e.preventDefault();
        if (currentActive >= 0 && currentActive < currentSuggestions.length) {
          handleSuggestionClick(index, currentSuggestions[currentActive]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setShowSuggestions((prev) => ({ ...prev, [index]: false }));
        break;
      case "Tab":
        if (currentActive >= 0) {
          e.preventDefault();
          handleSuggestionClick(index, currentSuggestions[currentActive]);
        }
        break;
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const validSkills = skills.filter(
      (skill) => skill.skillName.trim() && skill.proficiency
    );

    if (validSkills.length === 0) {
      setErrors({ general: "Please add at least one skill" });
      return;
    }

    try {
      const res = await fetchWithToken("/user/skills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validSkills),
      });

      if (!res.ok) {
        setErrors({ general: "Failed to save skills" });
        return;
      }

      router.push("/user/projects");
    } catch (error) {
      console.error(error);
      setErrors({ general: "Failed to save skills" });
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const clickedOutside = Object.values(suggestionRefs.current).every(
        (ref) => {
          return ref && !ref.contains(e.target as Node);
        }
      );

      const clickedOnInput = (e.target as HTMLElement).tagName === "INPUT";

      if (clickedOutside && !clickedOnInput) {
        setShowSuggestions({});
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Input styling
  const inputClasses = (fieldName: string) =>
    `w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 ${
      errors[fieldName]
        ? "border-red-300 bg-red-50"
        : "border-gray-300 hover:border-gray-400 focus:border-gray-500"
    }`;

  // Proficiency options
  const proficiencyOptions = [
    {
      value: "beginner",
      label: "Beginner",
      icon: Target,
      color: "text-red-500",
    },
    {
      value: "intermediate",
      label: "Intermediate",
      icon: TrendingUp,
      color: "text-yellow-500",
    },
    {
      value: "advanced",
      label: "Advanced",
      icon: Code2,
      color: "text-blue-500",
    },
    { value: "mastery", label: "Mastery", icon: Star, color: "text-green-500" },
  ];

  // Render the component
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-500 to-gray-800 rounded-t-xl p-6">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-3 rounded-lg">
            <Code2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Add Skills</h2>
            <p className="text-gray-200 text-sm">
              Enter your skills and proficiency levels
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Skills List */}
        <div className="space-y-6">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-6 bg-gray-50"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-semibold text-gray-700">
                  Skill {index + 1}
                </h3>
                {skills.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {/* Skill Name with Autocomplete */}
                <div className="relative">
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                    <Code2 className="w-4 h-4" />
                    <span>Skill Name *</span>
                  </label>
                  <div className="relative">
                    <input
                      placeholder="Start typing skill name (e.g., JavaScript, Python, Leadership)..."
                      value={skill.skillName}
                      onChange={(e) =>
                        handleSkillNameChange(index, e.target.value)
                      }
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onClick={() => handleInputClick(index)}
                      onFocus={() => handleInputClick(index)}
                      className={inputClasses(`skillName-${index}`)}
                      autoComplete="off"
                    />
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>

                  {/* Suggestions Dropdown */}
                  {showSuggestions[index] &&
                    suggestions[index] &&
                    suggestions[index].length > 0 && (
                      <div
                        ref={(el) => {
                          suggestionRefs.current[index] = el;
                        }}
                        className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto"
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        {suggestions[index].map((skill, suggestionIndex) => (
                          <button
                            key={`${index}-${suggestionIndex}`}
                            type="button"
                            onClick={() => handleSuggestionClick(index, skill)}
                            className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                              activeSuggestion[index] === suggestionIndex
                                ? "bg-blue-50 text-blue-700"
                                : "text-gray-700"
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <Code2 className="w-4 h-4 text-gray-400" />
                              <span>{skill}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                  {errors[`skillName-${index}`] && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors[`skillName-${index}`]}
                    </p>
                  )}
                </div>

                {/* Proficiency Level */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>Proficiency Level *</span>
                  </label>
                  <select
                    value={skill.proficiency}
                    onChange={(e) =>
                      handleChange(index, "proficiency", e.target.value)
                    }
                    className={inputClasses(`proficiency-${index}`)}
                  >
                    <option value="">Select Proficiency Level</option>
                    {proficiencyOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors[`proficiency-${index}`] && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors[`proficiency-${index}`]}
                    </p>
                  )}
                </div>

                {/* Proficiency Preview */}
                {skill.proficiency && (
                  <div className="mt-4 p-4 bg-white rounded-lg border">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 rounded-lg bg-gray-50">
                        {(() => {
          const option = proficiencyOptions.find(opt => opt.value === skill.proficiency);
          const Icon = option?.icon || Target;
          const color = option?.color || "text-gray-500";
          return <Icon className={`w-5 h-5 ${color}`} />;
        })()}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <h4
                            className={`font-semibold capitalize ${
                              proficiencyOptions.find(
                                (opt) => opt.value === skill.proficiency
                              )?.color || "text-gray-500"
                            }`}
                          >
                            {skill.proficiency}
                          </h4>
                        </div>
                        <div className="flex space-x-1 mt-3">
                          {[1, 2, 3, 4].map((level) => {
                            const isActive =
                              (skill.proficiency === "beginner" &&
                                level === 1) ||
                              (skill.proficiency === "intermediate" &&
                                level <= 2) ||
                              (skill.proficiency === "advanced" &&
                                level <= 3) ||
                              (skill.proficiency === "mastery" && level <= 4);
                            return (
                              <div
                                key={level}
                                className={`h-2 flex-1 rounded-full transition-colors duration-200 ${
                                  isActive
                                    ? proficiencyOptions
                                        .find(
                                          (opt) =>
                                            opt.value === skill.proficiency
                                        )
                                        ?.color.replace("text-", "bg-") ||
                                      "bg-gray-500"
                                    : "bg-gray-200"
                                }`}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add More Skills Button */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={addSkill}
            className="flex items-center space-x-2 px-6 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors text-gray-600 hover:text-gray-700"
          >
            <Plus className="w-5 h-5" />
            <span>Add Another Skill</span>
          </button>
        </div>

        {/* Proficiency Guide */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-4">
            Proficiency Guide:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {proficiencyOptions.map((option) => (
              <div key={option.value} className="flex items-start space-x-3">
                <div
                  className={`p-2 rounded-lg ${option.color.replace(
                    "text-",
                    "bg-"
                  )} bg-opacity-10`}
                >
                  <option.icon className={`w-5 h-5 ${option.color}`} />
                </div>
                <div>
                  <h5 className={`text-sm font-semibold ${option.color}`}>
                    {option.label}
                  </h5>
                  <p className="text-xs text-gray-500 mt-1">
                    {option.value === "beginner" && "Learning basics"}
                    {option.value === "intermediate" &&
                      "Can work independently"}
                    {option.value === "advanced" && "Can mentor others"}
                    {option.value === "mastery" && "Expert level"}
                  </p>
                </div>
              </div>
            ))}
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
            <span>Save All Skills</span>
          </button>
        </div>
      </div>
    </div>
  );
}
