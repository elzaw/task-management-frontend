"use client";
import instance from "@/axois/instance";
import { selectUserData, setUserData } from "@/store/slices/userSlice";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { SlLogout } from "react-icons/sl";
import { useDispatch, useSelector } from "react-redux";

const Navbar = () => {
  const dispatch = useDispatch();
  const userData = useSelector(selectUserData);

  const [open, setOpen] = useState(false);
  const links = [
    { url: "/", title: "Home" },
    { url: "/signup", title: "Signup" },
    { url: "/login", title: "Login" },
    { url: "/tasks", title: "Tasks" },
    { url: "/profile", title: "Profile" },
  ];

  useEffect(() => {
    const getUser = async () => {
      if (userData && userData.id) {
        try {
          const user = await instance.get(`users/${userData.id}`);
          console.log(user.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    getUser();
  }, []);

  return (
    <div className="h-full flex items-center justify-between px-4 sm:px-8 md:px-12 lg:px-20 xl:px-48">
      {/* Links */}
      <div className="hidden md:flex gap-4 w-1/3 ">
        {links.map((link) => (
          <Link href={link.url} key={link.url}>
            {link.title}
          </Link>
        ))}
      </div>

      {/* logo */}
      <div className="md:hidden lg:flex  justify-center">
        <Link
          href="/"
          className="text-sm bg-black rounded-md p-1 font-semibold flex items-center justify-center"
        >
          <span className="text-white mr-1">Task</span>
          <span className="w-16 h-8 rounded bg-white text-black flex items-center justify-center">
            .Manage
          </span>
        </Link>
      </div>
      {/* logout */}
      <div className="hidden md:flex gap-4 w-1/3 cursor-pointer">
        <SlLogout
          size={20}
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
        />
      </div>

      {/* responsive menu */}
      <div className="md:hidden ">
        {/* Menu button */}
        <button
          name=""
          className="w-10 h-8 flex flex-col justify-between z-50 relative"
          onClick={() => setOpen(!open)}
        >
          <div className="w-10 h-1 bg-red-800 rounded"></div>
          <div className="w-10 h-1 bg-red-800 rounded"></div>
          <div className="w-10 h-1 bg-red-800 rounded"></div>
        </button>

        {/* Menu list */}
        {open && (
          <div className="absolute top-0 left-0 w-screen h-screen bg-black text-white flex flex-col items-center justify-center gap-8 text-4xl">
            {links.map((link) => (
              <Link href={link.url} key={link.url}>
                {link.title}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
