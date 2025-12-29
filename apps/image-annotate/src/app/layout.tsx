import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Super Simple Image Annotate",
  description:
    "Free online image annotation tool. Draw, highlight, and add text to images in your browser. No upload required - your images stay private.",
  keywords: [
    "image annotate",
    "image markup",
    "draw on image",
    "add text to image",
    "highlight image",
    "free",
    "online",
    "no upload",
    "privacy",
  ],
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  themeColor: "#d97706",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-50`}>
        {children}
      </body>
    </html>
  );
}
