import Link from "next/link";
import { Footer } from "@super-simple-apps/shared-assets";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Image Crop
        </Link>

        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          About Super Simple Image Crop
        </h1>

        <div className="prose prose-lg text-gray-600 space-y-6">
          <p>
            Super Simple Image Crop is a free, privacy-focused tool that lets you
            crop and resize images directly in your browser. No uploads, no
            accounts, no waiting.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">
            How It Works
          </h2>
          <p>
            When you drop or select an image, it&apos;s processed entirely on your
            device using your browser&apos;s built-in capabilities. Your images never
            leave your computer - they&apos;re not uploaded to any server.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">
            Features
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Drag and drop or click to select images</li>
            <li>Crop to any size or aspect ratio</li>
            <li>Download cropped images instantly</li>
            <li>Supports PNG, JPG, GIF, and WebP formats</li>
            <li>Works offline once the page is loaded</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">
            Privacy
          </h2>
          <p>
            Your privacy is our priority. Since all processing happens in your
            browser, we never see your images. There&apos;s no tracking, no analytics
            on your images, and no data collection.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">
            Part of Super Simple Apps
          </h2>
          <p>
            Super Simple Image Crop is part of the{" "}
            <a
              href="https://super-simple-apps.com"
              className="text-blue-600 hover:text-blue-700"
            >
              Super Simple Apps
            </a>{" "}
            collection - free, simple tools that just work.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
