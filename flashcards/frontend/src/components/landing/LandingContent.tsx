"use client";

import React from "react";
import { Button } from "@nextui-org/react";

interface LandingContentProps {
  onBrowsePublicDecks?: () => void;
}

export const LandingContent: React.FC<LandingContentProps> = ({
  onBrowsePublicDecks,
}) => {
  return (
    <div className="min-h-[80vh] flex flex-col">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-4 py-12 md:py-16">
        <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Welcome to Super Simple Flashcards
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mb-8">
          The free, easy-to-use flashcard app for effective learning. Create
          your own decks or study from our community library.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8"
            size="lg"
            onPress={onBrowsePublicDecks}
          >
            Browse Public Decks
          </Button>
          <Button
            as="a"
            href="/about"
            className="border-2 border-blue-600 text-blue-600 bg-transparent px-8"
            size="lg"
            variant="bordered"
          >
            Learn More
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4 bg-gray-50 rounded-2xl mx-4">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Why Choose Super Simple Flashcards?
        </h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              100% Free
            </h3>
            <p className="text-gray-600">
              No hidden fees, no premium tiers. All features available to
              everyone for free.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Easy to Use
            </h3>
            <p className="text-gray-600">
              Create decks in seconds. No complex setup, just start learning
              immediately.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Access Anywhere
            </h3>
            <p className="text-gray-600">
              Study on any device. Your decks sync across desktop, tablet, and
              mobile.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 px-4">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          How It Works
        </h2>
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl flex-shrink-0">
              1
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold text-gray-800">
                Create Your Deck
              </h3>
              <p className="text-gray-600">
                Add questions and answers to build your flashcard deck. Organize
                by subject or topic.
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl flex-shrink-0">
              2
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold text-gray-800">
                Study & Review
              </h3>
              <p className="text-gray-600">
                Flip through cards, mark ones you know, and focus on what you
                need to learn.
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl flex-shrink-0">
              3
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold text-gray-800">
                Share & Discover
              </h3>
              <p className="text-gray-600">
                Make your decks public or browse thousands of community-created
                study materials.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-12 px-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl mx-4">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Perfect for Everyone
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="bg-white/80 rounded-xl p-4 text-center">
            <span className="text-3xl mb-2 block">📚</span>
            <h3 className="font-medium text-gray-800">Students</h3>
            <p className="text-sm text-gray-600">Ace your exams</p>
          </div>
          <div className="bg-white/80 rounded-xl p-4 text-center">
            <span className="text-3xl mb-2 block">🌍</span>
            <h3 className="font-medium text-gray-800">Language Learners</h3>
            <p className="text-sm text-gray-600">Master vocabulary</p>
          </div>
          <div className="bg-white/80 rounded-xl p-4 text-center">
            <span className="text-3xl mb-2 block">💼</span>
            <h3 className="font-medium text-gray-800">Professionals</h3>
            <p className="text-sm text-gray-600">Certifications & skills</p>
          </div>
          <div className="bg-white/80 rounded-xl p-4 text-center">
            <span className="text-3xl mb-2 block">🧠</span>
            <h3 className="font-medium text-gray-800">Lifelong Learners</h3>
            <p className="text-sm text-gray-600">Never stop growing</p>
          </div>
        </div>
      </section>

      {/* Footer Links */}
      <footer className="py-8 px-4 text-center text-gray-500 text-sm mt-auto">
        <div className="flex flex-wrap justify-center gap-4 mb-4">
          <a href="/about" className="hover:text-gray-700">
            About
          </a>
          <a href="/contact" className="hover:text-gray-700">
            Contact
          </a>
          <a href="/privacy" className="hover:text-gray-700">
            Privacy Policy
          </a>
          <a href="/terms" className="hover:text-gray-700">
            Terms of Service
          </a>
        </div>
        <p>&copy; {new Date().getFullYear()} Super Simple Flashcards. All rights reserved.</p>
      </footer>
    </div>
  );
};
