import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const { userId, redirectToSignIn } = await auth();

  // Redirect user to sign-in page
  if (!userId) return redirectToSignIn();

  const clerk = await clerkClient();
  const user = clerk.users.getUser(userId);
  const onboardingComplete = (await user).unsafeMetadata.onboardingComplete;

  // Redirect user to onboarding page if not complete
  if (!onboardingComplete) {
    redirect("/onboarding");
  } else {
    // Redirect user to dashboard page
    redirect("/dashboard");
  }
}
