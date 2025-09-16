"use client";

import LoadingPage from "@/components/LoadingPage";
// resumes/preview

import { fetchWithToken } from "@/lib/fetchWithToken";
import React, { useEffect, useState } from "react";

const ResumePreview = () => {
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch preview HTML from backend
  useEffect(() => {
    const fetchPreview = async () => {
      try {
        setLoading(true);
        const res = await fetchWithToken("/user/resumes/preview", {
          method: "GET",
        });
        if (!res.ok) throw new Error("Failed to fetch resume preview");
        const html = await res.text();

        setPreviewHtml(html);
      } catch (err: unknown) {
        console.error(err);
        setError("Failed to load resume preview. Please fix your content.");
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, []);
  const downloadPdf = async () => {
    try {
      const res = await fetchWithToken("/user/resumes/pdf", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
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
    <div className="resume-preview-container">
      <h1>Resume Preview</h1>
      <div
        className="resume-preview"
        dangerouslySetInnerHTML={{ __html: previewHtml }}
      />
      <button onClick={downloadPdf}>Download PDF</button>

      <style jsx>{`
        .resume-preview-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .resume-preview {
          border: 1px solid #ccc;
          padding: 20px;
          margin-top: 20px;
        }
        button {
          margin-top: 20px;
          padding: 10px 20px;
          background-color: #1d4ed8;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        button:hover {
          background-color: #2563eb;
        }
      `}</style>
    </div>
  );
};

export default ResumePreview;
