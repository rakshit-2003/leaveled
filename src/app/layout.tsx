import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "LeaveLedger — PTO Management for Teams",
    template: "%s | LeaveLedger",
  },
  description:
    "LeaveLedger helps teams manage PTO requests, track leave balances, and approve time off — all in one place.",
  keywords: ["leave management", "PTO tracker", "time off", "HR tool"],
  openGraph: {
    type: "website",
    siteName: "LeaveLedger",
    title: "LeaveLedger — PTO Management for Teams",
    description: "Manage PTO requests, leave balances, and approvals with ease.",
  },
  twitter: {
    card: "summary_large_image",
    title: "LeaveLedger — PTO Management for Teams",
    description: "Manage PTO requests, leave balances, and approvals with ease.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className} data-scroll-behavior="smooth">
      <body className="bg-gray-50 text-gray-900 antialiased">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
