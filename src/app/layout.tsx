import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Assure | Pre-Flight Checks for Human Decisions",
  description: "Stop costly human errors before they happen with intelligent, contextual guardrails for risky digital actions.",
  icons: {
    icon: [
      { url: "/Assure.png", sizes: "32x32", type: "image/png" },
      { url: "/Assure.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/Assure.png",
    apple: "/Assure.png",
  },
};

export const viewport = {
  themeColor: "#7c69ef",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Detect both correct spelling and potential typo found in environment config (PUBLTSHABLE)
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || (process.env as any).NEXT_PUBLIC_CLERK_PUBLTSHABLE_KEY;

  if (!publishableKey && process.env.NODE_ENV === 'production') {
    console.warn("⚠️ ERROR: Clerk Publishable Key is missing or has a typo in Railway (Check: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)");
  }

  // Provide a safe placeholder ONLY to allow the build/compiler to finish.
  // The real key from Railway will be used at runtime if provided.
  const activeKey = publishableKey || "pk_test_YnVpbGQtdGltZS1ieXBhc3Mta2V5LWRvLW5vdC11c2U=";

  return (
    <ClerkProvider
      publishableKey={activeKey}
      appearance={{ baseTheme: dark }}
    >
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
