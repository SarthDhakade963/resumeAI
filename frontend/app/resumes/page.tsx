"use client";

import LoadingPage from "@/components/LoadingPage";
import { fetchWithToken } from "@/lib/fetchWithToken";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Resume {
  name: string;
  email: string;
  summary: string;
  skills: string;
  projects: string;
  education: string;
  workExperience?: string;
}

export default function ResumePage() {
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await fetchWithToken("/user/resumes/data", {
          method: "GET",
        });
        if (!res.ok) throw new Error("Failed to fetch resume");
        const data: Resume = await res.json();
        setResume(data);
      } catch (error: unknown) {
        console.error(error);
        setError("Failed to load resume");
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, []);

  const saveResume = async () => {
    if (!resume) return;

    try {
      const res = await fetchWithToken("/user/resumes/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resume),
      });

      if (!res.ok) throw new Error("Preview failed"); // backend returns error if Thymeleaf fails

      const data = await res.json();

      localStorage.setItem("resumePreview", data.previewHtml);

      router.push("/preview");
    } catch (err) {
      console.error(err);
      alert("Error generating preview. Please fix your content and try again.");
    }
  };

  if (loading) return <LoadingPage />;
  if (error) return <p>{error}</p>;
  if (!resume) return <p>No resume data</p>;

  const handleChange =
    (field: keyof Resume) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setResume({ ...resume, [field]: e.target.value });
    };

  return (
    <div className="resume-container">
      <h1>Edit Resume</h1>
      <div className="resume-form">
        <label>Name</label>
        <input
          type="text"
          value={resume.name}
          onChange={handleChange("name")}
        />

        <label>Email</label>
        <input
          type="email"
          value={resume.email}
          onChange={handleChange("email")}
        />

        <label>Summary</label>
        <textarea value={resume.summary} onChange={handleChange("summary")} />

        <label>Skills</label>
        <textarea value={resume.skills} onChange={handleChange("skills")} />

        <label>Projects</label>
        <textarea value={resume.projects} onChange={handleChange("projects")} />

        <label>Education</label>
        <textarea
          value={resume.education}
          onChange={handleChange("education")}
        />

        {resume.workExperience !== undefined && (
          <>
            <label>Work Experience</label>
            <textarea
              value={resume.workExperience}
              onChange={handleChange("workExperience")}
            />
          </>
        )}

        <button onClick={saveResume}>Preview</button>
      </div>

      <style jsx>{`
        textarea {
          height: "150px";
        }

        .resume-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .resume-form label {
          display: block;
          margin-top: 15px;
          font-weight: bold;
        }
        .resume-form input,
        .resume-form textarea {
          width: 100%;
          margin-top: 5px;
          padding: 8px;
          font-family: Arial, sans-serif;
          font-size: 14px;
        }
        .resume-form button {
          margin-top: 20px;
          padding: 10px 20px;
          background-color: #1d4ed8;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .resume-form button:hover {
          background-color: #2563eb;
        }
      `}</style>
    </div>
  );
}
