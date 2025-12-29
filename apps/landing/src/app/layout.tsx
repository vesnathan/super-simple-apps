import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://super-simple-apps.com"),
  title: {
    default: "Super Simple Apps",
    template: "%s | Super Simple Apps",
  },
  description:
    "A collection of simple, useful web applications. No bloat, no complexity - just tools that work.",
  keywords: ["apps", "tools", "simple", "free", "web apps", "utilities"],
  authors: [{ name: "Super Simple Apps" }],
  openGraph: {
    title: "Super Simple Apps",
    description:
      "A collection of simple, useful web applications. No bloat, no complexity - just tools that work.",
    url: "https://super-simple-apps.com",
    siteName: "Super Simple Apps",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Super Simple Apps",
    description:
      "A collection of simple, useful web applications. No bloat, no complexity - just tools that work.",
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
