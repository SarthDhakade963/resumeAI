"use client";
import { useState, useRef, useEffect } from "react";
import {
  GraduationCap,
  Calendar,
  BookOpen,
  Award,
  Building,
  Plus,
  X,
  Save,
  ChevronDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { fetchWithToken } from "@/lib/fetchWithToken";

interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  grade: string;
  startDate: string;
  endDate?: string;
  currentlyStudying: boolean;
}

export default function EducationForm() {
  const [educations, setEducations] = useState<Education[]>([
    {
      institution: "",
      degree: "",
      fieldOfStudy: "",
      grade: "",
      startDate: "",
      endDate: "",
      currentlyStudying: false,
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
  const [customDegrees, setCustomDegrees] = useState<{ [key: number]: string }>(
    {}
  );

  const suggestionRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const router = useRouter();

  // Popular institutions for suggestions
  const popularInstitutions = [
    "Veermata Jijabai Technological Institute, Mumbai",
    "Harvard University",
    "Stanford University",
    "Massachusetts Institute of Technology (MIT)",
    "California Institute of Technology (Caltech)",
    "University of Oxford",
    "University of Cambridge",
    "ETH Zurich",
    "University of Chicago",
    "Imperial College London",
    "UCL (University College London)",
    "National University of Singapore (NUS)",
    "Nanyang Technological University (NTU)",
    "Tsinghua University",
    "Peking University",
    "University of Tokyo",
    "Kyoto University",
    "Seoul National University",
    "KAIST - Korea Advanced Institute of Science & Technology",
    "University of Toronto",
    "University of British Columbia",
    "McGill University",
    "University of Melbourne",
    "University of Sydney",
    "Australian National University",
    "University of New South Wales",
    "IIT Bombay",
    "IIT Delhi",
    "IIT Madras",
    "IIT Kharagpur",
    "IIT Kanpur",
    "University of Delhi",
    "University of Mumbai",
    "Anna University",
    "BITS Pilani",
    "VIT Vellore",
    "SRM University",
    "Manipal University",
    "Amity University",
    "Symbiosis International University",
    "Christ University",
    // Add more institutions as needed
  ];

  const degreeOptions = [
    "Bachelor of Arts (BA)",
    "Bachelor of Science (BS)",
    "Bachelor of Engineering (BE)",
    "Bachelor of Technology (BTech)",
    "Master of Arts (MA)",
    "Master of Science (MS)",
    "Master of Business Administration (MBA)",
    "Master of Technology (MTech)",
    "Doctor of Philosophy (PhD)",
    "None",
  ];

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    educations.forEach((education, index) => {
      if (!education.institution.trim()) {
        newErrors[`institution-${index}`] = "Institution is required";
      }
      if (!education.degree.trim()) {
        newErrors[`degree-${index}`] = "Degree is required";
      }
      if (!education.fieldOfStudy.trim()) {
        newErrors[`fieldOfStudy-${index}`] = "Field of study is required";
      }
      if (!education.startDate) {
        newErrors[`startDate-${index}`] = "Start date is required";
      }
      if (!education.currentlyStudying && !education.endDate) {
        newErrors[`endDate-${index}`] =
          "End date is required if not currently studying";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    index: number,
    field: keyof Education,
    value: string | boolean
  ) => {
    const updatedEducations = [...educations];
    updatedEducations[index] = {
      ...updatedEducations[index],
      [field]: value,
    };

    // Handle custom degree logic
    if (field === "degree") {
      if (value === "Other") {
        setCustomDegrees((prev) => ({ ...prev, [index]: "" }));
      } else {
        const newCustomDegrees = { ...customDegrees };
        delete newCustomDegrees[index];
        setCustomDegrees(newCustomDegrees);
      }
    }

    // Clear end date when currently studying is checked
    if (field === "currentlyStudying" && value) {
      updatedEducations[index].endDate = "";
    }

    setEducations(updatedEducations);

    // Clear error when user starts typing
    const errorKey = `${field}-${index}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: "" }));
    }
  };

  const handleInstitutionChange = (index: number, value: string) => {
    handleChange(index, "institution", value);

    if (value.length > 0) {
      const filteredSuggestions = popularInstitutions.filter((institution) =>
        institution.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions((prev) => ({ ...prev, [index]: filteredSuggestions }));
      setShowSuggestions((prev) => ({ ...prev, [index]: true }));
      setActiveSuggestion((prev) => ({ ...prev, [index]: -1 }));
    }
  };

  const handleInputClick = (index: number) => {
    const currentValue = educations[index].institution;

    if (currentValue.length > 0) {
      const filteredSuggestions = popularInstitutions.filter((institution) =>
        institution.toLowerCase().includes(currentValue.toLowerCase())
      );
      setSuggestions((prev) => ({ ...prev, [index]: filteredSuggestions }));
    } else {
      setSuggestions((prev) => ({
        ...prev,
        [index]: [...popularInstitutions],
      }));
    }

    setShowSuggestions((prev) => ({ ...prev, [index]: true }));
  };

  const handleSuggestionClick = (index: number, institution: string) => {
    const updatedEducations = [...educations];
    updatedEducations[index] = {
      ...updatedEducations[index],
      institution,
    };

    setEducations(updatedEducations);

    setShowSuggestions((prev) => ({ ...prev, [index]: false }));
    setActiveSuggestion((prev) => ({ ...prev, [index]: -1 }));

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`institution-${index}`];
      return newErrors;
    });

    // Focus back on the input after selection
    const inputElement = document.getElementById(`institution-input-${index}`);
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

  const addEducation = () => {
    setEducations([
      ...educations,
      {
        institution: "",
        degree: "",
        fieldOfStudy: "",
        grade: "",
        startDate: "",
        endDate: "",
        currentlyStudying: false,
      },
    ]);
  };

  const removeEducation = (index: number) => {
    if (educations.length > 1) {
      const updatedEducations = educations.filter((_, i) => i !== index);
      setEducations(updatedEducations);

      // Clear related states
      const newErrors = { ...errors };
      const newCustomDegrees = { ...customDegrees };
      const newSuggestions = { ...suggestions };
      const newShowSuggestions = { ...showSuggestions };
      const newActiveSuggestion = { ...activeSuggestion };

      Object.keys(newErrors).forEach((key) => {
        if (key.endsWith(`-${index}`)) {
          delete newErrors[key];
        }
      });

      delete newCustomDegrees[index];
      delete newSuggestions[index];
      delete newShowSuggestions[index];
      delete newActiveSuggestion[index];

      setErrors(newErrors);
      setCustomDegrees(newCustomDegrees);
      setSuggestions(newSuggestions);
      setShowSuggestions(newShowSuggestions);
      setActiveSuggestion(newActiveSuggestion);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const validEducations = educations.filter(
      (edu) =>
        edu.institution.trim() &&
        edu.degree.trim() &&
        edu.fieldOfStudy.trim() &&
        edu.startDate &&
        (edu.currentlyStudying || edu.endDate)
    );

    if (validEducations.length === 0) {
      setErrors({
        general: "Please add at least one complete education entry",
      });
      return;
    }

    try {
      const res = await fetchWithToken("/user/edu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validEducations),
      });

      if (!res.ok) {
        setErrors({ general: "Failed to save education" });
        return;
      }

      router.push("/user/work-exp");
    } catch (error) {
      console.error(error);
      setErrors({ general: "Failed to save education" });
    }
  };

  const inputClasses = (fieldName: string) =>
    `w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 ${
      errors[fieldName]
        ? "border-red-300 bg-red-50"
        : "border-gray-300 hover:border-gray-400 focus:border-gray-500"
    }`;

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

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-t-xl p-6">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-3 rounded-lg">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Add Education</h2>
            <p className="text-gray-200 text-sm">
              Enter your educational background details
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="space-y-6">
          {educations.map((education, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-6 bg-gray-50"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-700">
                  Education {index + 1}
                </h3>
                {educations.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEducation(index)}
                    className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {/* Institution with Autocomplete */}
                <div className="relative">
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                    <Building className="w-4 h-4" />
                    <span>Institution *</span>
                  </label>
                  <div className="relative">
                    <input
                      id={`institution-input-${index}`}
                      placeholder="e.g., Stanford University, IIT Bombay"
                      value={education.institution}
                      onChange={(e) =>
                        handleInstitutionChange(index, e.target.value)
                      }
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onClick={() => handleInputClick(index)}
                      onFocus={() => handleInputClick(index)}
                      className={inputClasses(`institution-${index}`)}
                      autoComplete="off"
                    />
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>

                  {showSuggestions[index] && suggestions[index]?.length > 0 && (
                    <div
                      ref={(el) => {
                        suggestionRefs.current[index] = el;
                      }}
                      className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto"
                    >
                      {suggestions[index].map(
                        (institution, suggestionIndex) => (
                          <button
                            key={`${index}-${suggestionIndex}`}
                            type="button"
                            onClick={() =>
                              handleSuggestionClick(index, institution)
                            }
                            className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                              activeSuggestion[index] === suggestionIndex
                                ? "bg-blue-50 text-blue-700"
                                : "text-gray-700"
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <Building className="w-4 h-4 text-gray-400" />
                              <span>{institution}</span>
                            </div>
                          </button>
                        )
                      )}
                    </div>
                  )}

                  {errors[`institution-${index}`] && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors[`institution-${index}`]}
                    </p>
                  )}
                </div>

                {/* Degree and Field - Row */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                      <Award className="w-4 h-4" />
                      <span>Degree *</span>
                    </label>
                    <select
                      value={
                        education.degree === "Other"
                          ? "Other"
                          : education.degree
                      }
                      onChange={(e) =>
                        handleChange(index, "degree", e.target.value)
                      }
                      className={inputClasses(`degree-${index}`)}
                    >
                      <option value="">Select Degree</option>
                      {degreeOptions.map((degree) => (
                        <option key={degree} value={degree}>
                          {degree}
                        </option>
                      ))}
                    </select>
                    {errors[`degree-${index}`] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors[`degree-${index}`]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                      <BookOpen className="w-4 h-4" />
                      <span>Field of Study *</span>
                    </label>
                    <input
                      placeholder="e.g., Computer Science, Business"
                      value={education.fieldOfStudy}
                      onChange={(e) =>
                        handleChange(index, "fieldOfStudy", e.target.value)
                      }
                      className={inputClasses(`fieldOfStudy-${index}`)}
                    />
                    {errors[`fieldOfStudy-${index}`] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors[`fieldOfStudy-${index}`]}
                      </p>
                    )}
                  </div>
                </div>

                {/* Grade */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Grade/CGPA (Optional)
                  </label>
                  <input
                    placeholder="e.g., 3.8 GPA, 85%, First Class"
                    value={education.grade}
                    onChange={(e) =>
                      handleChange(index, "grade", e.target.value)
                    }
                    className={inputClasses(`grade-${index}`)}
                  />
                </div>

                {/* Dates */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>Start Date *</span>
                    </label>
                    <input
                      type="date"
                      value={education.startDate}
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
                        End Date {!education.currentlyStudying && "*"}
                      </span>
                    </label>
                    <input
                      type="date"
                      value={education.endDate || ""}
                      onChange={(e) =>
                        handleChange(index, "endDate", e.target.value)
                      }
                      disabled={education.currentlyStudying}
                      className={`${inputClasses(`endDate-${index}`)} ${
                        education.currentlyStudying
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

                {/* Currently Studying Checkbox */}
                <div className="flex items-center space-x-3 p-4 bg-white rounded-lg border">
                  <input
                    type="checkbox"
                    id={`currentlyStudying-${index}`}
                    checked={education.currentlyStudying}
                    onChange={(e) =>
                      handleChange(index, "currentlyStudying", e.target.checked)
                    }
                    className="w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 rounded focus:ring-gray-500 focus:ring-2"
                  />
                  <label
                    htmlFor={`currentlyStudying-${index}`}
                    className="text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    I am currently studying here
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add More Education Button */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={addEducation}
            className="flex items-center space-x-2 px-6 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors text-gray-600 hover:text-gray-700"
          >
            <Plus className="w-5 h-5" />
            <span>Add Another Education</span>
          </button>
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
            <span>Save All Education</span>
          </button>
        </div>
      </div>
    </div>
  );
}
