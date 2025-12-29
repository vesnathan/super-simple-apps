import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for Super Simple Apps - Learn how we handle your data.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        <p className="text-gray-600 mb-8">
          Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>

        <div className="prose prose-lg text-gray-600 max-w-none">
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Overview
            </h2>
            <p>
              At Super Simple Apps, we take your privacy seriously. This Privacy
              Policy explains how we collect, use, and protect your information
              when you use our applications and services.
            </p>
            <p className="mt-4">
              <strong>The short version:</strong> We collect minimal data, we
              don&apos;t sell your information, and we don&apos;t track you
              across the web.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Information We Collect
            </h2>
            <h3 className="text-xl font-medium text-gray-900 mt-6 mb-3">
              Information You Provide
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Account information:</strong> If you create an account,
                we collect your email address and any profile information you
                choose to provide.
              </li>
              <li>
                <strong>Content:</strong> Data you create within our apps (such
                as flashcard decks) is stored to provide you with the service.
              </li>
              <li>
                <strong>Communications:</strong> If you contact us, we keep
                records of our correspondence.
              </li>
            </ul>

            <h3 className="text-xl font-medium text-gray-900 mt-6 mb-3">
              Information Collected Automatically
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Usage data:</strong> Basic analytics about how you use
                our apps (pages visited, features used) to help us improve.
              </li>
              <li>
                <strong>Device information:</strong> Browser type, operating
                system, and device type for compatibility purposes.
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              How We Use Your Information
            </h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Provide, maintain, and improve our services</li>
              <li>
                Send you important updates about our apps (only if you&apos;ve
                opted in)
              </li>
              <li>Respond to your questions and support requests</li>
              <li>Detect and prevent fraud or abuse</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Information Sharing
            </h2>
            <p>
              <strong>We do not sell your personal information.</strong> We only
              share your information in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>
                <strong>With your consent:</strong> When you explicitly agree to
                share information.
              </li>
              <li>
                <strong>Service providers:</strong> We work with trusted
                third-party services (like cloud hosting) that help us operate
                our apps. These providers are bound by confidentiality
                agreements.
              </li>
              <li>
                <strong>Legal requirements:</strong> When required by law or to
                protect our rights and safety.
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Data Security
            </h2>
            <p>
              We implement industry-standard security measures to protect your
              data, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Encryption of data in transit (HTTPS)</li>
              <li>Encryption of sensitive data at rest</li>
              <li>Regular security assessments</li>
              <li>Access controls and authentication</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Your Rights
            </h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>
                <strong>Access:</strong> Request a copy of the data we have
                about you
              </li>
              <li>
                <strong>Correction:</strong> Update or correct your information
              </li>
              <li>
                <strong>Deletion:</strong> Request deletion of your account and
                data
              </li>
              <li>
                <strong>Export:</strong> Download your data in a portable format
              </li>
            </ul>
            <p className="mt-4">
              To exercise these rights, please contact us at the address below.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Cookies
            </h2>
            <p>
              We use essential cookies to make our apps work properly. These
              include:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Authentication cookies to keep you logged in</li>
              <li>Preference cookies to remember your settings</li>
            </ul>
            <p className="mt-4">
              We do not use third-party advertising cookies or track you across
              other websites.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Children&apos;s Privacy
            </h2>
            <p>
              Our services are not directed to children under 13. We do not
              knowingly collect personal information from children under 13. If
              you believe we have collected information from a child, please
              contact us immediately.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. We will
              notify you of significant changes by posting a notice on our
              website or sending you an email.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Contact Us
            </h2>
            <p>
              If you have questions about this Privacy Policy or our data
              practices, please contact us at:
            </p>
            <p className="mt-4">
              <a
                href="/contact"
                className="text-primary-600 hover:text-primary-700"
              >
                super-simple-apps.com/contact
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
