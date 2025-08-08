"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Eye, EyeOff, MailIcon, User2Icon } from "lucide-react";

export default function AuthForm({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [newUser, setNewUser] = useState(false);

  const toggleForm = () => {
    setNewUser((prev) => !prev);
  };

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const emailValid = emailRegex.test(email);
    const passwordValid = passwordRegex.test(password);

    setIsValidEmail(emailValid);
    setIsValidPassword(passwordValid);

    if (!emailValid || !passwordValid) {
      console.log("Form invalid");
      return;
    }
    // Proceed with form submission
    console.log("Form submitted: ", { email, password }); //
  };

  return (
    <div className="h-screen-md fixed inset-0 z-50 bg-transparent bg-opacity-60 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-xl text-gray-600"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">
          {newUser ? "Sign Up" : "Sign In"}
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {newUser && (
            <div>
              <label
                htmlFor="Username"
                className="font-medium block mb-2 ml-1 text-md text-left"
              >
                Username{" "}
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 border rounded focus:border-gray-600 focus:ring-2 focus:ring-gray-300 focus:outline-none"
                  required
                />

                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <User2Icon className="h-5 w-5 text-gray-600" />
                </div>
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor="Email"
              className="font-medium block mb-2 ml-1 text-md text-left"
            >
              Email{" "}
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-2 border rounded focus:border-gray-600 focus:ring-2 ${
                  isValidEmail ? "border-gray-300" : "border-red-500"
                } focus:outline-none`}
                required
              />

              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <MailIcon className="h-5 w-5 text-gray-600" />
              </div>
            </div>
            {!isValidEmail && (
              <p className="text-red-600 text-sm mt-1 text-left">
                Invalid email format
              </p>
            )}
          </div>

          <div className="relative">
            <label
              htmlFor="password"
              className="font-medium block mb-2 ml-1 text-md text-left"
            >
              Password{" "}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-2 border rounded focus:border-gray-600 focus:ring-2 ${
                  isValidPassword ? "focus:ring-gray-300" : "focus:ring-red-300"
                } focus:outline-none`}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-600" />
                )}
              </button>
            </div>

            {!isValidPassword && (
              <p className="text-red-600 text-sm mt-1 text-left">
                Password must be at least 8 characters long and include
                uppercase, lowercase, number, and special character.
              </p>
            )}
          </div>

          <div className="flex justify-center w-full items-center">
            <p>
              {newUser ? "Already have an Account?" : "Create a New Account?"}
              <button
                className="text-gray-600 hover:text-gray-800 font-bold hover:underline transition-color ml-2"
                onClick={toggleForm}
              >
                {newUser ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>
          <Button className="w-full mt-1 hover:bg-gray-500 text-white py-2 rounded">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
}
