"use client";

import { useClerk } from "@clerk/nextjs";
import { Button } from "./ui/button";

export default function SignOutButton({ className }: { className?: string }) {
  const { signOut } = useClerk();

  return (
    <Button
      className={`w-full ${className}`}
      variant={"destructiveLight"}
      onClick={() => signOut({ redirectUrl: "/sign-in" })}
    >
      Sign out
    </Button>
  );
}
