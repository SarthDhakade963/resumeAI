"use client";
import AuthButton from "@/components/AuthButton";

export default function Home() {
  return (
    <main className="h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold mb-4">
        AI Resume & Cover Letter Generator
      </h1>
      <p className="mb-6">
        Enter your details, and get a professional resume + cover letter with
        AI.
      </p>
      <AuthButton />
    </main>
  );
}
