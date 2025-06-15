import { auth, clerkClient } from "@clerk/nextjs/server";
import { toast } from "sonner";
import UserCard from "@/components/user-card";
import SignOutButton from "@/components/sign-out-button";
import EditProfileButton from "@/components/edit-profile-button";
import { fetchUserInfo } from "@/db/query";

export default async function Settings() {
  const { userId } = await auth();

  if (!userId) return null;

  const clerk = await clerkClient();
  const user = clerk.users.getUser(userId);
  const email = (await user).emailAddresses[0].emailAddress;

  const result = await fetchUserInfo();

  const data = {
    fName: result ? result.data?.f_name : "",
    lName: result ? result.data?.l_name : "",
    currency: result ? result.data?.currency : "",
    email: email ? email : "",
    profilePictureUrl: result ? result.data?.profile_picture_url : "",
  };

  return (
    <div className="flex flex-col items-center w-full p-2">
      <div className="max-w-2xl w-full">
        <UserCard
          fName={data.fName}
          lName={data.lName}
          currency={data.currency}
          email={data.email}
          profilePictureUrl={data.profilePictureUrl}
          className="mb-4"
        />
        <EditProfileButton className="mb-4" />
        <SignOutButton className="mb-4" />
      </div>
    </div>
  );
}
