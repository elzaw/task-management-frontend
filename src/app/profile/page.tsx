"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CardContent, Card } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { selectUserData } from "@/store/slices/userSlice";
import instance from "@/axois/instance";

interface UserInfo {
  name: string;
  username: string;
  profile: string | "#"; // Allow profile to be a string or '#'
  profilePictureUrl: string | "";
  // Add other properties as needed
}

const Profile = () => {
  const dispatch = useDispatch();
  const userData = useSelector(selectUserData);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await instance.get(`users/${userData.id}`);
        setUserInfo(response.data); // Update userInfo state with fetched data
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    if (userData && userData.id) {
      getUserInfo(); // Fetch user info only if userData.id is available
    }
  }, [userData]); // Include userData in the dependency array

  return (
    <main className="flex items-center justify-center min-h-screen m-5">
      <Card className="w-full max-w-3xl">
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center">
            {userInfo &&
              userInfo.profilePictureUrl !== "" && ( // Check if userInfo is not null and profilePictureUrl is not an empty string
                <img
                  alt="Profile Image"
                  className="rounded-full h-120 w-120 object-cover"
                  src={userInfo.profilePictureUrl}
                />
              )}
          </div>
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">{userInfo?.name}</h1>
            <p className="text-sm leading-none text-gray-500 dark:text-gray-400">
              @{userInfo?.username}
            </p>
          </div>
          <div className="space-y-2">
            <dl className="grid grid-cols-2 gap-2">
              <div className="font-medium">Name</div>
              <div>{userInfo?.name}</div>
              <div className="font-medium">Username</div>
              <div>@{userInfo?.username}</div>
              <div className="font-medium">LinkedIn</div>
              <div>
                {userInfo && userInfo.profile !== "#" ? ( // Check if userInfo is not null and profile is not '#'
                  <Link href={userInfo.profile} target="_blank">
                    <span className="underline">{userInfo.profile}</span>
                  </Link>
                ) : (
                  <span>{userInfo?.profile}</span>
                )}
              </div>
            </dl>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default Profile;
