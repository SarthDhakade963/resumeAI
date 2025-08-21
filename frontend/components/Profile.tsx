"use client";

import React, { useState, useRef } from "react";
import { Upload, User, Camera, Check, ArrowRight, FileText } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const ProfileSetup = () => {
  const session = useSession();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [summary, setSummary] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        setImageFile(file);
        setPreviewUrl(URL.createObjectURL(file));
      }
    }
  };

  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  async function submit() {
    // Validation
    if (!fullName.trim()) {
      alert("Please enter your full name");
      return;
    }
    if (!username.trim()) {
      alert("Please enter a username");
      return;
    }
    if (!summary.trim()) {
      alert("Please enter a profile summary");
      return;
    }
    if (!imageFile) {
      alert("Please select a profile photo");
      return;
    }

    setLoading(true);

    console.log("Sending:", { fullName, username, summary, imageFile });

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("username", username);
    formData.append("summary", summary);
    if (imageFile) formData.append("profilePic", imageFile);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SPRING_BASE_URL}/auth/profile-setup`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.data?.accessToken}`,
          },
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error("Failed to save profile");
      }

      alert("Profile updated successfully!");
      router.push("/user/skills");
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-gray-500 to-gray-900 rounded-2xl mb-4 shadow-lg">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Profile
          </h1>
          <p className="text-gray-600">
            Add your details to create your professional profile
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8 space-y-6">
            {/* Image Upload Section */}
            <div className="space-y-4">
              <label className="block text-md font-semibold text-gray-700 mb-3">
                Profile Photo
              </label>

              {previewUrl ? (
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative group">
                    <div className="w-38 h-38 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                      <Image
                        src={previewUrl}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                        height={100}
                        width={100}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={openFileSelector}
                      className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all duration-200"
                    >
                      <Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={openFileSelector}
                    className="text-gray-600 text-sm font-medium hover:text-gray-700 transition-colors duration-200 hover:underline"
                  >
                    Change Photo
                  </button>
                </div>
              ) : (
                <div
                  className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 cursor-pointer group hover:border-indigo-400 hover:bg-indigo-50 ${
                    dragActive
                      ? "border-gray-400 bg-gray-50"
                      : "border-gray-300"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={openFileSelector}
                >
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-16 h-16 bg-gradient-to-r from-gray-500 to-gray-900 rounded-2xl flex items-center justify-center shadow-lg">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-gray-900 mb-1">
                        Upload your photo
                      </p>
                      <p className="text-sm text-gray-500">
                        Drag & drop or click to browse
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
                className="hidden"
              />
            </div>

            {/* Full Name Section */}
            <div className="space-y-3">
              <label className="block text-md font-semibold text-gray-700">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="Enter your full name"
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-gray-100 focus:border-gray-700 transition-all duration-200 text-gray-800 placeholder-gray-500"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Username Section */}
            <div className="space-y-3">
              <label className="block text-md font-semibold text-gray-700">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Enter your username"
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-gray-100 focus:border-gray-700 transition-all duration-200 text-gray-800 placeholder-gray-500"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <span className="text-gray-400 text-sm">@</span>
                </div>
              </div>
            </div>

            {/* Summary Section */}
            <div className="space-y-3">
              <label className="block text-md font-semibold text-gray-700">
                Professional Summary
              </label>
              <div className="relative">
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  required
                  placeholder="Write a brief summary about yourself, your skills, and experience..."
                  rows={4}
                  maxLength={500}
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-gray-100 focus:border-gray-700 transition-all duration-200 text-gray-800 placeholder-gray-500 resize-none"
                />
                <div className="absolute bottom-3 right-3 flex items-center space-x-2">
                  <span className="text-xs text-gray-400">
                    {summary.length}/500
                  </span>
                  <FileText className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              <p className="text-xs text-gray-500">
                This will be displayed on your public profile
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={submit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-gray-400 to-gray-900 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving Profile...</span>
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  <span>Complete Setup</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Your information is secure and will not be shared
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;