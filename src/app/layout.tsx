import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { PWAInstallPrompt } from "@/components/pwa-install-prompt";
import { organizationSchema, websiteSchema } from "@/lib/seo/structured-data";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://aiubfiles.app'),
  title: {
    default: "Missing Semester AIUB - Essential Learning Resources",
    template: "%s | Missing Semester AIUB"
  },
  description: "Access comprehensive course materials, lecture notes, assignments, and resources for AIUB students. Your journey to academic excellence starts here with organized, easy-to-find study materials.",
  keywords: [
    "AIUB",
    "Missing Semester",
    "course materials",
    "lecture notes",
    "study resources",
    "AIUB students",
    "university resources",
    "educational platform",
    "academic excellence",
    "Bangladesh university",
    "computer science",
    "engineering courses"
  ],
  authors: [{ name: "Missing Semester AIUB" }],
  creator: "Missing Semester AIUB",
  publisher: "Missing Semester AIUB",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Missing Semester",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aiubfiles.app",
    title: "Missing Semester AIUB - Essential Learning Resources",
    description: "Access comprehensive course materials, lecture notes, and resources for AIUB students.",
    siteName: "Missing Semester AIUB",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Missing Semester AIUB",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Missing Semester AIUB - Essential Learning Resources",
    description: "Access comprehensive course materials, lecture notes, and resources for AIUB students.",
    images: ["/og-image.png"],
    creator: "@missingsemester",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={inter.className}>
        {children}
        <Toaster />
        <PWAInstallPrompt />
      </body>
    </html>
  );
}
