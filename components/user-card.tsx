"use client";

import Image from "next/image";
import type { UserCardProps } from "@/types";

export default function UserCard({
  fName,
  lName,
  currency,
  email,
  profilePictureUrl,
  className,
}: UserCardProps) {
  return (
    <section
      className={`bg-white w-full rounded-lg px-2 py-4 md:p-2 ring-sidebar-ring ring-[0.1px] ${className}`}
    >
      <div className="flex flex-col md:flex-row items-center gap-5">
        <div className="w-40 h-40 overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={profilePictureUrl}
            height={200}
            width={200}
            alt="User profile picture"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex gap-2 text-xl">
            <span>{fName}</span>
            <span>{lName}</span>
          </div>
          <div className="text-md">{email}</div>
          <div className="text-md">Preferred currency: {currency}</div>
        </div>
      </div>
    </section>
  );
}
