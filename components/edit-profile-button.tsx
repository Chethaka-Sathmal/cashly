"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function EditProfileButton({
  className,
}: {
  className?: string;
}) {
  const router = useRouter();

  return (
    <Button
      className={`w-full ${className}`}
      variant="themeLight"
      onClick={() => router.push("/settings/edit-profile")}
    >
      Edit profile
    </Button>
  );
}
