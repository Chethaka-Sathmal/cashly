import { SignedIn, UserButton } from "@clerk/nextjs";

export default function Dashboard() {
  return (
    <main className="bg-red-200">
      <h1>Dashboard</h1>
      {/* <SignedIn> */}
      <UserButton />
      <p>Signed in</p>
      {/* </SignedIn> */}
    </main>
  );
}
