"use client"; // The parent app-sidebar.tsx is a client component

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";

export default function SidebarFooterComponent() {
  const [userInfo, setUserInfo] = useState({
    fName: "",
    lName: "",
    profilePictureURL: "",
  });

  useEffect(() => {
    async function getUserData() {
      try {
        const res = await fetch("/api/fetch-footer-info");
        if (!res.ok) {
          throw new Error("Failed to fetch");
        }

        const result = await res.json();
        const data = result.data;
        setUserInfo({
          fName: data.f_name,
          lName: data.l_name,
          profilePictureURL: data.profile_picture_url,
        });
      } catch (err) {
        console.error("Error fetching user info:", err);
        toast.error("Error fetching footer data");
      }
    }

    getUserData();
  }, []);

  const { user } = useUser();
  const pathname = usePathname();

  return (
    <Link
      href={"/settings"}
      className={cn(
        "flex items-center gap-4 p-3 bg-gray-100 rounded-md w-full ring-sidebar-ring ring-[0.15px]",
        pathname === "/settings" && "ring-theme/30 ring-1 bg-theme/10"
      )}
    >
      {user && (
        <>
          <div className="w-10 h-10 overflow-hidden rounded-full bg-gray-100">
            {userInfo.profilePictureURL ? (
              <Image
                src={userInfo.profilePictureURL}
                alt="User profile picture"
                height={45}
                width={45}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <User size={24} className="text-gray-600" />
              </div>
            )}
          </div>
          <div>
            <div className="flex gap-2">
              <span>{userInfo.fName}</span>
              <span>{userInfo.lName}</span>
            </div>
            <span className="text-gray-500 text-sm">
              {user?.primaryEmailAddress?.emailAddress}
            </span>
          </div>
        </>
      )}
    </Link>
  );
}
