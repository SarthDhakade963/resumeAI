"use client";
import { useState, useRef, useEffect } from "react";
import {
  Building2,
  User,
  FileText,
  Calendar,
  Plus,
  X,
  Save,
  ChevronDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { fetchWithToken } from "@/lib/fetchWithToken";

interface WorkExperience {
  companyName: string;
  position: string;
  description: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
}

interface WorkExperiencePayload {
  isFresher: boolean;
  workExperiences: Array<{
    companyName: string;
    position: string;
    description: string;
    startDate: string;
    endDate: string | null;
    currentlyWorking: boolean;
  }>;
}

export default function WorkExperienceForm() {
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([
    {
      companyName: "",
      position: "",
      description: "",
      startDate: "",
      endDate: "",
      currentlyWorking: false,
    },
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

  const router = useRouter();

  const [isFresher, setIsFresher] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [success, setSuccess] = useState(false);

  const handleFresherToggle = (checked: boolean) => {
    setIsFresher(checked);
    if (checked) {
      // Clear all work experiences when marked as fresher
      setWorkExperiences([
        {
          companyName: "",
          position: "",
          description: "",
          startDate: "",
          endDate: "",
          currentlyWorking: false,
        },
      ]);
      setErrors({});
    }
  };

  const popularCompanies = [
    "Google",
    "Microsoft",
    "Apple",
    "Amazon",
    "Meta",
    "Netflix",
    "Tesla",
    "Uber",
    "Airbnb",
    "Spotify",
    "Adobe",
    "Salesforce",
    "Oracle",
    "IBM",
    "Intel",
    "NVIDIA",
    "Twitter",
    "LinkedIn",
    "PayPal",
    "Square",
    "Stripe",
    "Shopify",
    "Zoom",
    "Slack",
    "Dropbox",
    "GitHub",
    "GitLab",
    "Atlassian",
    "Red Hat",
    "VMware",
    "Cisco",
    "Accenture",
    "Deloitte",
    "PwC",
    "KPMG",
    "EY",
    "McKinsey & Company",
    "BCG",
    "JP Morgan",
    "Goldman Sachs",
    "Morgan Stanley",
    "Bank of America",
    "Wells Fargo",
    "Infosys",
    "TCS",
    "Wipro",
    "HCL Technologies",
    "Tech Mahindra",
    "Cognizant",
    "Startups",
    "Freelance",
    "Consulting",
    "Self-Employed",
  ];

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    workExperiences.forEach((experience, index) => {
      if (!experience.companyName.trim()) {
        newErrors[`companyName-${index}`] = "Company name is required";
      }
      if (!experience.position.trim()) {
        newErrors[`position-${index}`] = "Position is required";
      }
      if (!experience.description.trim()) {
        newErrors[`description-${index}`] = "Description is required";
      }
      if (!experience.startDate) {
        newErrors[`startDate-${index}`] = "Start date is required";
      }
      if (!experience.currentlyWorking && !experience.endDate) {
        newErrors[`endDate-${index}`] =
          "End date is required if not currently working";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    index: number,
    field: keyof WorkExperience,
    value: string | boolean
  ) => {
    const updatedExperiences = [...workExperiences];
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      [field]: value,
    };

    if (field === "currentlyWorking" && value) {
      updatedExperiences[index].endDate = "";
    }

    setWorkExperiences(updatedExperiences);

    const errorKey = `${field}-${index}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: "" }));
    }
  };

  const handleCompanyNameChange = (index: number, value: string) => {
    handleChange(index, "companyName", value);

    if (value.length > 0) {
      const filteredSuggestions = popularCompanies.filter((company) =>
        company.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions((prev) => ({ ...prev, [index]: filteredSuggestions }));
      setShowSuggestions((prev) => ({ ...prev, [index]: true }));
      setActiveSuggestion((prev) => ({ ...prev, [index]: -1 }));
    }
  };

  // Add this separate click handler
  const handleInputClick = (index: number) => {
    const currentValue = workExperiences[index].companyName;

    if (currentValue.length > 0) {
      // If there's text, show filtered suggestions
      const filteredSuggestions = popularCompanies.filter((companyName) =>
        companyName.toLowerCase().includes(currentValue.toLowerCase())
      );
      setSuggestions((prev) => ({ ...prev, [index]: filteredSuggestions }));
    } else {
      // If empty, show all suggestions
      setSuggestions((prev) => ({ ...prev, [index]: [...popularCompanies] }));
    }

    setShowSuggestions((prev) => ({ ...prev, [index]: true }));
  };

  const handleSuggestionClick = (index: number, company: string) => {
    setWorkExperiences((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        companyName: company,
      };
      return updated;
    });

    setShowSuggestions((prev) => ({ ...prev, [index]: false }));
    setActiveSuggestion((prev) => ({ ...prev, [index]: -1 }));

    // Clear any error for this field
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`companyName-${index}`];
      return newErrors;
    });

    // Focus back on the input after selection
    const inputElement = document.getElementById(`company-input-${index}`);
    if (inputElement) {
      inputElement.focus();
    }
  };

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
      case "Tab":
        if (currentActive >= 0) {
          e.preventDefault();
          handleSuggestionClick(index, currentSuggestions[currentActive]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setShowSuggestions((prev) => ({ ...prev, [index]: false }));
        break;
    }
  };

  const addWorkExperience = () => {
    setWorkExperiences([
      ...workExperiences,
      {
        companyName: "",
        position: "",
        description: "",
        startDate: "",
        endDate: "",
        currentlyWorking: false,
      },
    ]);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // Check if we clicked outside all suggestion boxes and not on an input
      const clickedOutsideSuggestions = Object.values(
        suggestionRefs.current
      ).every((ref) => {
        return ref && !ref.contains(e.target as Node);
      });

      const clickedOnInput = (e.target as HTMLElement).tagName === "INPUT";

      if (clickedOutsideSuggestions && !clickedOnInput) {
        setShowSuggestions({});
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const removeWorkExperience = (index: number) => {
    if (workExperiences.length > 1) {
      const updatedExperiences = workExperiences.filter((_, i) => i !== index);
      setWorkExperiences(updatedExperiences);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setSuccess(false); // Reset success state on new submission

    if (!isFresher && !validateForm()) {
      setIsSubmitting(false);
      return;
    }


    try {
      const payload: WorkExperiencePayload = {
        isFresher,
        workExperiences: isFresher
          ? []
          : workExperiences
              .filter(
                (exp) =>
                  exp.companyName.trim() &&
                  exp.position.trim() &&
                  exp.description.trim() &&
                  exp.startDate &&
                  (exp.currentlyWorking || exp.endDate)
              )
              .map((exp) => ({
                ...exp,
                startDate: new Date(exp.startDate).toISOString(),
                endDate: exp.currentlyWorking
                  ? null
                  : new Date(exp.endDate).toISOString(),
              })),
      };

      console.log("Payload sent:", payload);

      const res = await fetchWithToken("/user/work-exp", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      console.log("Response to the payload", res.text());

      if (!res.ok) {
        await res.text().catch(() => ({}));
        throw new Error("Failed to save work experience");
      }
      // Set success state and redirect
      setSuccess(true);

      // Add console log to verify this is being called
      console.log("Submission successful, redirecting...");

      // Redirect after 1.5 seconds
      console.log("Executing redirect...");
      router.push("/dashboard");
    } catch (error) {
      console.error("Submission error:", error);
      setErrors({
        general:
          error instanceof Error
            ? error.message
            : "Failed to save work experience",
      });
    } finally {
      setIsSubmitting(false);
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

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        !Object.values(suggestionRefs.current).some((ref) => {
          if (ref) {
            ref.contains(e.target as Node);
          }
        })
      ) {
        setShowSuggestions({});
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-t-xl p-6">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-3 rounded-lg">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              Add Work Experience
            </h2>
            <p className="text-gray-200 text-sm">
              Enter your professional work experience details
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Success Message */}
        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-600">
              Work experience saved successfully! Redirecting...
            </p>
          </div>
        )}
        {/* Fresher Toggle */}
        <div className="flex items-center space-x-3 p-4 bg-white rounded-lg border">
          <input
            type="checkbox"
            id="isFresher"
            checked={isFresher}
            onChange={(e) => handleFresherToggle(e.target.checked)}
            className="w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 rounded focus:ring-gray-500 focus:ring-2"
          />
          <label
            htmlFor="isFresher"
            className="text-sm font-medium text-gray-700 cursor-pointer"
          >
            I am a fresher (no work experience)
          </label>
        </div>

        {!isFresher && (
          <div className="|">
            <div className="space-y-6">
              {workExperiences.map((experience, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-6 bg-gray-50"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-semibold text-gray-700">
                      Job {index + 1}
                    </h3>
                    {workExperiences.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeWorkExperience(index)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div className="relative">
                      <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                        <Building2 className="w-4 h-4" />
                        <span>Company Name *</span>
                      </label>
                      <div className="relative">
                        <input
                          id={`company-input-${index}`}
                          placeholder="Start typing company name (e.g., Microsoft, Google, JP Morgan)..."
                          value={experience.companyName}
                          onChange={(e) =>
                            handleCompanyNameChange(index, e.target.value)
                          }
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          onClick={() => handleInputClick(index)}
                          onFocus={() => handleInputClick(index)}
                          className={inputClasses(`companyName-${index}`)}
                          autoComplete="off"
                        />
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                      {showSuggestions[index] &&
                        suggestions[index] &&
                        suggestions[index]?.length > 0 && (
                          <div
                            ref={(el) => {
                              suggestionRefs.current[index] = el;
                            }}
                            className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto"
                          >
                            {suggestions[index].map(
                              (company, suggestionIndex) => (
                                <button
                                  key={`${index}-${suggestionIndex}`}
                                  type="button"
                                  onClick={() =>
                                    handleSuggestionClick(index, company)
                                  }
                                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                                    activeSuggestion[index] === suggestionIndex
                                      ? "bg-blue-50 text-blue-700"
                                      : "text-gray-700"
                                  }`}
                                >
                                  <div className="flex items-center space-x-2">
                                    <Building2 className="w-4 h-4 text-gray-400" />
                                    <span>{company}</span>
                                  </div>
                                </button>
                              )
                            )}
                          </div>
                        )}
                      {errors[`companyName-${index}`] && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors[`companyName-${index}`]}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                        <User className="w-4 h-4" />
                        <span>Position *</span>
                      </label>
                      <input
                        placeholder="e.g., Software Engineer, Product Manager, Data Scientist"
                        value={experience.position}
                        onChange={(e) =>
                          handleChange(index, "position", e.target.value)
                        }
                        className={inputClasses(`position-${index}`)}
                      />
                      {errors[`position-${index}`] && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors[`position-${index}`]}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                        <FileText className="w-4 h-4" />
                        <span>Job Description *</span>
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Describe your responsibilities, achievements, technologies used, and key contributions..."
                        value={experience.description}
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
                        Include key responsibilities, achievements,
                        technologies, and quantifiable results
                      </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                          <Calendar className="w-4 h-4" />
                          <span>Start Date *</span>
                        </label>
                        <input
                          type="date"
                          value={experience.startDate}
                          onChange={(e) =>
                            handleChange(index, "startDate", e.target.value)
                          }
                          className={inputClasses(`startDate-${index}`)}
                        />
                        {errors[`startDate-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors[`startDate-${index}`]}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            End Date {!experience.currentlyWorking && "*"}
                          </span>
                        </label>
                        <input
                          type="date"
                          value={experience.endDate}
                          onChange={(e) =>
                            handleChange(index, "endDate", e.target.value)
                          }
                          disabled={experience.currentlyWorking}
                          className={`${inputClasses(`endDate-${index}`)} ${
                            experience.currentlyWorking
                              ? "bg-gray-100 cursor-not-allowed"
                              : ""
                          }`}
                        />
                        {errors[`endDate-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors[`endDate-${index}`]}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-white rounded-lg border">
                      <input
                        type="checkbox"
                        id={`currentlyWorking-${index}`}
                        checked={experience.currentlyWorking}
                        onChange={(e) =>
                          handleChange(
                            index,
                            "currentlyWorking",
                            e.target.checked
                          )
                        }
                        className="w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 rounded focus:ring-gray-500 focus:ring-2"
                      />
                      <label
                        htmlFor={`currentlyWorking-${index}`}
                        className="text-sm font-medium text-gray-700 cursor-pointer"
                      >
                        I am currently working here
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-center">
          <button
            type="button"
            onClick={addWorkExperience}
            className="flex items-center space-x-2 px-6 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors text-gray-600 hover:text-gray-700"
          >
            <Plus className="w-5 h-5" />
            <span>Add Another Work Experience</span>
          </button>
        </div>

        {errors.general && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{errors.general}</p>
          </div>
        )}

        <div className="pt-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-900 hover:to-gray-800 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 shadow-lg flex items-center justify-center space-x-2"
          >
            <Save className="w-5 h-5" />
            <span>Save All Work Experience</span>
          </button>
        </div>
      </div>
    </div>
  );
}
