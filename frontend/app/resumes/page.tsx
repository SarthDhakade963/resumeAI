"use client";

import Loading from "@/components/Loading";
import LoadingPage from "@/components/LoadingPage";
import { fetchWithToken } from "@/lib/fetchWithToken";
import { useEffect, useState } from "react";

interface ResumeDTO {
  enhancedResume: string;
}

export default function ResumePage() {
  const [resume, setResume] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await fetchWithToken("/user/resumes", { method: "GET" });
        if (!res.ok) throw new Error("Failed to fetch resume");
        const data: ResumeDTO = await res.json();
        setResume(data.enhancedResume);

        console.log("Resume data : ", resume);
      } catch (error) {
        console.log(error);
        return <Loading />;
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, []);

  const downloadPdf = async () => {
    try {
      const res = await fetchWithToken("/user/resumes/generate", {
        method: "GET",
      });
      if (!res.ok) throw new Error("Failed to download PDF");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "resume.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <LoadingPage />;
  if (error) return <p>{error}</p>;

  return (
    <div className="resume-container">
      <h1>Resume Preview</h1>

      {/* Render AI-enhanced HTML directly */}
      <div
        className="resume-preview"
        dangerouslySetInnerHTML={{ __html: resume || "" }}
      />

      <button
        onClick={downloadPdf}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Download PDF
      </button>

      <style jsx>{`
        .resume-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
        }
        .resume-preview {
          border: 1px solid #ddd;
          padding: 20px;
          background-color: #fff;
        }
      `}</style>
    </div>
  );
}
