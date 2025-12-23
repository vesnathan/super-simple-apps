import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Super Simple Flashcards",
  description:
    "Privacy Policy for Super Simple Flashcards - Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  const lastUpdated = "December 22, 2025";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-500 mb-8">Last updated: {lastUpdated}</p>

          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                1. Introduction
              </h2>
              <p className="text-gray-600 mb-4">
                Welcome to Super Simple Flashcards (&quot;we,&quot;
                &quot;our,&quot; or &quot;us&quot;). We are committed to
                protecting your personal information and your right to privacy.
                This Privacy Policy explains how we collect, use, disclose, and
                safeguard your information when you use our flashcard
                application.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                2. Information We Collect
              </h2>

              <h3 className="text-lg font-medium text-gray-800 mb-2">
                2.1 Personal Information
              </h3>
              <p className="text-gray-600 mb-4">
                When you create an account, we collect:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
                <li>Email address</li>
                <li>Password (encrypted)</li>
                <li>Account preferences</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800 mb-2">
                2.2 Usage Data
              </h3>
              <p className="text-gray-600 mb-4">
                We automatically collect certain information when you use our
                service:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
                <li>Device information (browser type, operating system)</li>
                <li>IP address</li>
                <li>Pages visited and features used</li>
                <li>Time and date of visits</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800 mb-2">
                2.3 Flashcard Content
              </h3>
              <p className="text-gray-600 mb-4">
                We store the flashcard decks and cards you create. Public decks
                are visible to other users, while private decks are only
                accessible to you.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                3. How We Use Your Information
              </h2>
              <p className="text-gray-600 mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
                <li>Provide and maintain our service</li>
                <li>Authenticate your account and secure your data</li>
                <li>Sync your flashcard decks across devices</li>
                <li>Improve our application and user experience</li>
                <li>Send important service updates (if opted in)</li>
                <li>Respond to your inquiries and support requests</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                4. Data Storage and Security
              </h2>
              <p className="text-gray-600 mb-4">
                Your data is stored securely using Amazon Web Services (AWS)
                infrastructure. We implement appropriate technical and
                organizational security measures to protect your personal
                information, including:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
                <li>Encryption of data in transit (HTTPS/TLS)</li>
                <li>Encryption of data at rest</li>
                <li>Secure password hashing</li>
                <li>Regular security audits</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                5. Third-Party Services
              </h2>
              <p className="text-gray-600 mb-4">We use the following third-party services:</p>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
                <li>
                  <strong>Amazon Web Services (AWS):</strong> Cloud
                  infrastructure and data storage
                </li>
                <li>
                  <strong>Amazon Cognito:</strong> User authentication and
                  identity management
                </li>
                <li>
                  <strong>Google AdSense:</strong> Display advertising (see
                  their privacy policy for more information)
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                6. Cookies and Tracking
              </h2>
              <p className="text-gray-600 mb-4">
                We use essential cookies to maintain your session and
                preferences. Third-party advertising partners may also use
                cookies to serve relevant advertisements. You can control cookie
                preferences through your browser settings.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                7. Your Rights
              </h2>
              <p className="text-gray-600 mb-4">You have the right to:</p>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Delete your account and associated data</li>
                <li>Export your flashcard decks</li>
                <li>Opt out of marketing communications</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                8. Children&apos;s Privacy
              </h2>
              <p className="text-gray-600 mb-4">
                Our service is not intended for children under 13 years of age.
                We do not knowingly collect personal information from children
                under 13. If you are a parent or guardian and believe your child
                has provided us with personal information, please contact us.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                9. Changes to This Policy
              </h2>
              <p className="text-gray-600 mb-4">
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the &quot;Last updated&quot; date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                10. Contact Us
              </h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about this Privacy Policy or our data
                practices, please contact us at:
              </p>
              <p className="text-gray-600">
                Email: privacy@super-simple-flashcards.com
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
