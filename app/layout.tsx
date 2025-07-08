import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter, Roboto_Slab } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoSlab = Roboto_Slab({
  variable: "--font-roboto-slab",
  subsets: ["latin"],
  weight: ["400"],
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cashly",
  description: "Expense tracker app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl={"/sign-in"}>
      <html
        lang="en"
        className={`${inter.variable} ${robotoSlab.variable} antialiased`}
      >
        <body className="font-inter bg-background">
          <main>{children}</main>
          <Toaster
            position="top-center"
            toastOptions={{
              classNames: {
                // default description text color too light for light mode
                description: "!text-gray-600",
              },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
