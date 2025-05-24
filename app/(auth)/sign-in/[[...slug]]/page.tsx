import { SignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  return (
    <main className="flex justify-center items-center h-screen">
      <SignIn fallbackRedirectUrl="/dashboard" />
    </main>
  );
}
