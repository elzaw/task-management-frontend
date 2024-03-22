"use client";
import React, { useState } from "react";
import instance from "@/axois/instance";
import { useRouter } from "next/navigation";
import Link from "next/link";
import jwt from "jsonwebtoken";
import { useDispatch } from "react-redux";
import { setUserData } from "@/store/slices/userSlice";

const LoginForm: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await instance.post("/auth/login", formData);

      if (response.status === 200) {
        const data = response.data;
        console.log("Login successful:", data);

        // Save the token in local storage
        localStorage.setItem("token", data.access_token);
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const decodedToken = jwt.verify(token, "this-my-secret");
            dispatch(setUserData(decodedToken));
          } catch (error) {
            console.error("Error verifying token:", error);
            // Handle invalid token or verification errors here
          }
        } else {
          console.error("Token not found in localStorage");
          // Handle case where token is not found
        }

        setTimeout(() => {
          router.push("/tasks");
        }, 2000);

        // Optionally, you can redirect the user or perform other actions upon successful login.
      } else {
        console.error("Login failed:", response.statusText);
        // Optionally, you can display an error message to the user.
      }
    } catch (error) {
      console.error("Error during login:", error);
      // Handle any network errors or other exceptions here.
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
        <div className="mb-6">
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
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Log In
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
