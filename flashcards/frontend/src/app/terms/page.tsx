import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Super Simple Flashcards",
  description:
    "Terms of Service for Super Simple Flashcards - Read our terms and conditions for using the flashcard application.",
};

export default function TermsPage() {
  const lastUpdated = "December 22, 2025";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-500 mb-8">Last updated: {lastUpdated}</p>

          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-600 mb-4">
                By accessing or using Super Simple Flashcards (&quot;the
                Service&quot;), you agree to be bound by these Terms of Service.
                If you do not agree to these terms, please do not use our
                Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                2. Description of Service
              </h2>
              <p className="text-gray-600 mb-4">
                Super Simple Flashcards is a web-based application that allows
                users to create, study, and share digital flashcard decks. The
                Service includes:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
                <li>Creating and managing flashcard decks</li>
                <li>Studying flashcards with interactive flip cards</li>
                <li>Sharing decks publicly with other users</li>
                <li>Syncing decks across devices (for registered users)</li>
                <li>Browsing and studying public flashcard decks</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                3. User Accounts
              </h2>
              <p className="text-gray-600 mb-4">
                To access certain features of the Service, you may need to
                create an account. You agree to:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
                <li>Provide accurate and complete registration information</li>
                <li>Maintain the security of your account credentials</li>
                <li>
                  Notify us immediately of any unauthorized use of your account
                </li>
                <li>
                  Accept responsibility for all activities under your account
                </li>
              </ul>
              <p className="text-gray-600 mb-4">
                You may also use the Service without an account, but your
                flashcard decks will only be stored locally in your browser.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                4. User Content
              </h2>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                4.1 Ownership
              </h3>
              <p className="text-gray-600 mb-4">
                You retain ownership of the flashcard content you create. By
                making a deck public, you grant us and other users a
                non-exclusive license to view, use, and study your content.
              </p>

              <h3 className="text-lg font-medium text-gray-800 mb-2">
                4.2 Prohibited Content
              </h3>
              <p className="text-gray-600 mb-4">You agree not to create or share content that:</p>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
                <li>Infringes on intellectual property rights</li>
                <li>
                  Contains illegal, harmful, or offensive material
                </li>
                <li>Spreads misinformation or false information</li>
                <li>
                  Violates the privacy or rights of others
                </li>
                <li>Contains malware, spam, or malicious content</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800 mb-2">
                4.3 Content Moderation
              </h3>
              <p className="text-gray-600 mb-4">
                We reserve the right to remove any content that violates these
                terms or that we deem inappropriate, without prior notice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                5. Acceptable Use
              </h2>
              <p className="text-gray-600 mb-4">You agree not to:</p>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
                <li>Use the Service for any unlawful purpose</li>
                <li>
                  Attempt to gain unauthorized access to our systems
                </li>
                <li>
                  Interfere with or disrupt the Service or servers
                </li>
                <li>
                  Use automated scripts to access the Service without permission
                </li>
                <li>
                  Impersonate any person or entity
                </li>
                <li>
                  Collect user information without consent
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                6. Intellectual Property
              </h2>
              <p className="text-gray-600 mb-4">
                The Service, including its design, features, and content (excluding user-generated content), is protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, or create derivative works based on our Service without prior written consent.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                7. Third-Party Services
              </h2>
              <p className="text-gray-600 mb-4">
                Our Service may contain links to third-party websites or services. We are not responsible for the content, privacy practices, or availability of these external sites. The inclusion of any link does not imply endorsement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                8. Disclaimers
              </h2>
              <p className="text-gray-600 mb-4">
                THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
                <li>Merchantability or fitness for a particular purpose</li>
                <li>Accuracy or completeness of content</li>
                <li>Uninterrupted or error-free operation</li>
                <li>Security of transmitted data</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                9. Limitation of Liability
              </h2>
              <p className="text-gray-600 mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR GOODWILL, ARISING FROM YOUR USE OF THE SERVICE.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                10. Indemnification
              </h2>
              <p className="text-gray-600 mb-4">
                You agree to indemnify and hold harmless Super Simple Flashcards and its operators from any claims, damages, losses, or expenses arising from your use of the Service or violation of these Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                11. Termination
              </h2>
              <p className="text-gray-600 mb-4">
                We may suspend or terminate your access to the Service at any time, with or without cause, and with or without notice. Upon termination, your right to use the Service will immediately cease.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                12. Changes to Terms
              </h2>
              <p className="text-gray-600 mb-4">
                We reserve the right to modify these Terms at any time. We will notify users of significant changes by posting the new Terms on this page. Your continued use of the Service after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                13. Governing Law
              </h2>
              <p className="text-gray-600 mb-4">
                These Terms shall be governed by and construed in accordance with the laws of Australia, without regard to its conflict of law provisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                14. Contact Information
              </h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <p className="text-gray-600">
                Email: legal@super-simple-flashcards.com
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100">
            <a
              href="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              <svg
                className="w-4 h-4 mr-2"
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
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
