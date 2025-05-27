import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export default function SidebarFooterComponent() {
  const { user } = useUser();

  return (
    <Link
      href={"/settings"}
      className="flex items-center gap-4 p-3 bg-gray-100 rounded-md w-full"
    >
      {user && (
        <>
          <div>
            <Image
              src={user.imageUrl}
              alt="User profile picture"
              height={45}
              width={45}
              className="rounded-full"
            />
          </div>
          <div>
            <span>Hello World </span>
            <span className="text-gray-500 text-sm">
              {user?.primaryEmailAddress?.emailAddress}
            </span>
          </div>
        </>
      )}
    </Link>
  );
}
