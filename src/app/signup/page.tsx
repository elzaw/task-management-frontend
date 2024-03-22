"use client";
import React, { useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import instance from "@/axois/instance";

const SignupForm: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    linkedInURL: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [linkedInURL, setlinkedInURL] = useState(true);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
   e.preventDefault();
   if (formData.password !== formData.confirmPassword) {
     setPasswordsMatch(false);
     return;
   }

   try {
     // Perform user registration (POST)
     const userResponse = await instance.post("/users", {
       username: formData.username,
       password: formData.password,
     });

     if (userResponse.status === 201) {
       console.log("User registered successfully!");

       // Perform user profile update (PUT)
       const profileResponse = await instance.put("/users/profile", {
         username: formData.username,
         linkedinUrl: formData.linkedInURL,
       });

       if (profileResponse.status === 200) {
         console.log("Profile saved successfully!");
       } else {
         console.error("Failed to save profile:", profileResponse.statusText);
       }

       // Reset form data and navigate to another page
       setFormData({
         username: "",
         password: "",
         confirmPassword: "",
         linkedInURL: "",
       });
       router.push("/login");
     } else {
       console.error("Failed to register user:", userResponse.statusText);
     }
   } catch (error: any) {
     console.error("Error:", error.message);
   }
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
              {showPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
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
              {showConfirmPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
            </span>
          </div>
          {!passwordsMatch && (
            <p className="text-red-500 text-xs italic">
              Passwords do not match.
            </p>
          )}
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="linkedInURL"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                passwordsMatch ? "" : "border-red-500"
              }`}
              id="linkedInURL"
              type="text"
              placeholder="attatch your linkedIn URL"
              name="linkedInURL"
              value={formData.linkedInURL}
              onChange={handleChange}
            />
          </div>
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
