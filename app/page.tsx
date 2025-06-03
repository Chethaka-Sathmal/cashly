import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default async function Page() {
  const { userId, redirectToSignIn } = await auth();
  const { isLoaded, user } = useUser();

  if (!userId) {
    return redirectToSignIn();
  } else if (userId && !user?.unsafeMetadata.onboardingComplete) {
    redirect("/onboarding");
  } else {
    redirect("/dashboard");
  }
}
