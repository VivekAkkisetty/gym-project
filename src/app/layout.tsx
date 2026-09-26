import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://apexfit.vercel.app"),
  title: {
    default: "ApexFit — High-Performance Fitness & Nutrition Platform",
    template: "%s | ApexFit",
  },
  description:
    "Production-grade fitness platform for tracking nutrition, macros, workouts, splits, and physique metrics with Supabase Row Level Security.",
  keywords: [
    "fitness tracker",
    "macro calculator",
    "workout log",
    "progressive overload",
    "diet plan",
    "exercise database",
    "TDEE calculator",
    "body recomposition",
  ],
  authors: [{ name: "ApexFit Team" }],
  creator: "ApexFit",
  publisher: "ApexFit",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://apexfit.vercel.app",
    title: "ApexFit — High-Performance Fitness & Nutrition Platform",
    description:
      "One complete platform for diet, nutrition, workout splits, body measurements, and fitness analytics.",
    siteName: "ApexFit",
  },
  twitter: {
    card: "summary_large_image",
    title: "ApexFit — High-Performance Fitness & Nutrition Platform",
    description:
      "One complete platform for diet, nutrition, workout splits, body measurements, and fitness analytics.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster position="bottom-right" richColors />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
