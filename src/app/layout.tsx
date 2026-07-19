import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        {/* Inline script to set dark class before paint — prevents flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme:dark)').matches;if(t==='dark'||(t===null&&d)){document.documentElement.classList.add('dark')}})()`,
          }}
        />
      </head>
      <body className="bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
