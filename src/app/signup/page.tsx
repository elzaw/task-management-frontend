"use client";
import React, { useState } from "react";

const SignupForm: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Reset password matching validation when either password or confirm password changes
    if (name === "password" || name === "confirmPassword") {
      setPasswordsMatch(true);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setPasswordsMatch(false);
      return;
    }
    // Handle form submission logic here
    console.log("Form submitted:", formData);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Username
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            type="text"
            placeholder="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <div className="relative">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            <span
              className="absolute right-0 top-0 mt-2 mr-2 cursor-pointer"
              onClick={toggleShowPassword}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="confirmPassword"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                passwordsMatch ? "" : "border-red-500"
              }`}
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <span
              className="absolute right-0 top-0 mt-2 mr-2 cursor-pointer"
              onClick={toggleShowConfirmPassword}
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </span>
          </div>
          {!passwordsMatch && (
            <p className="text-red-500 text-xs italic">
              Passwords do not match.
            </p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
