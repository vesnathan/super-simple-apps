import Link from "next/link";
import { Footer } from "@super-simple-apps/shared-assets";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center text-amber-600 hover:text-amber-700 mb-8"
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
          Back to Image Annotate
        </Link>

        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          About Super Simple Image Annotate
        </h1>

        <div className="prose prose-lg text-gray-600 space-y-6">
          <p>
            Super Simple Image Annotate is a free, privacy-focused tool that lets you
            draw, highlight, and add text to images directly in your browser. Perfect
            for marking up screenshots, creating quick tutorials, or highlighting
            important parts of images.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">
            How It Works
          </h2>
          <p>
            When you drop or select an image, it&apos;s processed entirely on your
            device using your browser&apos;s built-in canvas capabilities. Your images
            never leave your computer - they&apos;re not uploaded to any server.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">
            Annotation Tools
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Draw</strong> - Freehand drawing for circling or marking areas</li>
            <li><strong>Highlight</strong> - Semi-transparent marker for emphasis</li>
            <li><strong>Line</strong> - Draw straight lines</li>
            <li><strong>Arrow</strong> - Point to specific areas</li>
            <li><strong>Rectangle</strong> - Box around content</li>
            <li><strong>Text</strong> - Add labels and notes</li>
            <li><strong>Blur</strong> - Pixelate sensitive information</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">
            Features
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Multiple colors to choose from</li>
            <li>Adjustable stroke width</li>
            <li>Undo and redo support</li>
            <li>Export at full resolution</li>
            <li>Send to Crop or Resize for further editing</li>
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
            Works with Other Image Tools
          </h2>
          <p>
            Super Simple Image Annotate integrates seamlessly with{" "}
            <a
              href="https://crop.super-simple-apps.com"
              className="text-amber-600 hover:text-amber-700"
            >
              Super Simple Image Crop
            </a>
            {" "}and{" "}
            <a
              href="https://resize.super-simple-apps.com"
              className="text-amber-600 hover:text-amber-700"
            >
              Super Simple Image Resize
            </a>
            . After annotating an image, you can send it directly to either tool
            for further editing.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">
            Part of Super Simple Apps
          </h2>
          <p>
            Super Simple Image Annotate is part of the{" "}
            <a
              href="https://super-simple-apps.com"
              className="text-amber-600 hover:text-amber-700"
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
