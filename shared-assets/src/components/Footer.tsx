"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export interface FooterProps {
  /** Logo image URL (defaults to /logo.png) */
  logoUrl?: string;
}

export const Footer: React.FC<FooterProps> = ({
  logoUrl = "/logo.png",
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="https://super-simple-apps.com" className="flex items-center gap-2">
              <Image
                src={logoUrl}
                alt="Super Simple Apps"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <span className="font-semibold text-xl text-gray-900">
                Super Simple Apps
              </span>
            </Link>
            <p className="mt-4 text-gray-600 max-w-md">
              Simple, useful web applications. No bloat, no complexity - just
              tools that work.
            </p>
          </div>

          {/* Apps */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Our Apps</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://flashcards.super-simple-apps.com"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Flashcards
                </Link>
              </li>
              <li>
                <Link
                  href="https://crop.super-simple-apps.com"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Image Crop
                </Link>
              </li>
              <li>
                <Link
                  href="https://resize.super-simple-apps.com"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Image Resize
                </Link>
              </li>
              <li>
                <Link
                  href="https://annotate.super-simple-apps.com"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Image Annotate
                </Link>
              </li>
              <li>
                <Link
                  href="https://job-timer.super-simple-apps.com"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Job Timer
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://super-simple-apps.com/privacy"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="https://super-simple-apps.com/terms"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="https://super-simple-apps.com/contact"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-500 text-sm">
            &copy; {currentYear} Super Simple Apps. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
