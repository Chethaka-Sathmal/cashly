/**
 * ⚠️ Create later
 * Start by uncommenting the code below
 * Code from Clerk documentation -> https://clerk.com/docs/custom-flows/forgot-password
 */

import { redirect } from "next/navigation";

export default function Temp() {
  /**
   * Handles the redirection if someone accesses this page by typing URL
   * Redirect logic is handled by app/page.tsx page
   */
  redirect("/");
}

// "use client";

// import React, { useEffect, useState } from "react";
// import { useAuth, useSignIn } from "@clerk/nextjs";
// import type { NextPage } from "next";
// import { useRouter } from "next/navigation";

// const ForgotPasswordPage: NextPage = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [code, setCode] = useState("");
//   const [successfulCreation, setSuccessfulCreation] = useState(false);
//   const [secondFactor, setSecondFactor] = useState(false);
//   const [error, setError] = useState("");

//   const router = useRouter();
//   const { isSignedIn } = useAuth();
//   const { isLoaded, signIn, setActive } = useSignIn();

//   useEffect(() => {
//     if (isSignedIn) {
//       router.push("/");
//     }
//   }, [isSignedIn, router]);

//   if (!isLoaded) {
//     return null;
//   }

//   // Send the password reset code to the user's email
//   async function create(e: React.FormEvent) {
//     e.preventDefault();
//     await signIn
//       ?.create({
//         strategy: "reset_password_email_code",
//         identifier: email,
//       })
//       .then((_) => {
//         setSuccessfulCreation(true);
//         setError("");
//       })
//       .catch((err) => {
//         console.error("error", err.errors[0].longMessage);
//         setError(err.errors[0].longMessage);
//       });
//   }

//   // Reset the user's password.
//   // Upon successful reset, the user will be
//   // signed in and redirected to the home page
//   async function reset(e: React.FormEvent) {
//     e.preventDefault();
//     await signIn
//       ?.attemptFirstFactor({
//         strategy: "reset_password_email_code",
//         code,
//         password,
//       })
//       .then((result) => {
//         // Check if 2FA is required
//         if (result.status === "needs_second_factor") {
//           setSecondFactor(true);
//           setError("");
//         } else if (result.status === "complete") {
//           // Set the active session to
//           // the newly created session (user is now signed in)
//           setActive({ session: result.createdSessionId });
//           setError("");
//         } else {
//           console.log(result);
//         }
//       })
//       .catch((err) => {
//         console.error("error", err.errors[0].longMessage);
//         setError(err.errors[0].longMessage);
//       });
//   }

//   return (
//     <div>
//       <h1>Forgot Password?</h1>
//       <form onSubmit={!successfulCreation ? create : reset}>
//         {!successfulCreation && (
//           <>
//             <label htmlFor="email">Provide your email address</label>
//             <input
//               type="email"
//               placeholder="e.g john@doe.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />

//             <button>Send password reset code</button>
//             {error && <p>{error}</p>}
//           </>
//         )}

//         {successfulCreation && (
//           <>
//             <label htmlFor="password">Enter your new password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />

//             <label htmlFor="password">
//               Enter the password reset code that was sent to your email
//             </label>
//             <input
//               type="code"
//               value={code}
//               onChange={(e) => setCode(e.target.value)}
//             />

//             <button>Reset</button>
//             {error && <p>{error}</p>}
//           </>
//         )}

//         {secondFactor && (
//           <p>2FA is required, but this UI does not handle that</p>
//         )}
//       </form>
//     </div>
//   );
// };

// export default ForgotPasswordPage;
