import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for Super Simple Apps - The rules for using our applications.",
};

export default function TermsPage() {
  return (
    <div className="bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Terms of Service
        </h1>
        <p className="text-gray-600 mb-8">
          Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>

        <div className="prose prose-lg text-gray-600 max-w-none">
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Agreement to Terms
            </h2>
            <p>
              By accessing or using Super Simple Apps (&quot;the Service&quot;),
              you agree to be bound by these Terms of Service. If you disagree
              with any part of these terms, you may not access the Service.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Description of Service
            </h2>
            <p>
              Super Simple Apps provides a collection of web-based applications
              designed to help users with various tasks. Our services are
              provided &quot;as is&quot; and are subject to change without
              notice.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              User Accounts
            </h2>
            <p>Some features may require you to create an account. When you do:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>You must provide accurate and complete information</li>
              <li>
                You are responsible for maintaining the security of your account
              </li>
              <li>
                You are responsible for all activities that occur under your
                account
              </li>
              <li>
                You must notify us immediately of any unauthorized use of your
                account
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Acceptable Use
            </h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>
                Use the Service for any illegal purpose or in violation of any
                laws
              </li>
              <li>
                Upload content that is offensive, harmful, threatening, or
                violates the rights of others
              </li>
              <li>
                Attempt to gain unauthorized access to our systems or other
                users&apos; accounts
              </li>
              <li>
                Use automated systems (bots, scrapers) to access the Service
                without permission
              </li>
              <li>
                Interfere with or disrupt the Service or servers connected to
                the Service
              </li>
              <li>
                Transmit viruses, malware, or other malicious code
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              User Content
            </h2>
            <p>
              You retain ownership of any content you create using our apps
              (such as flashcard decks). By using our Service, you grant us a
              limited license to store, display, and process your content solely
              to provide the Service to you.
            </p>
            <p className="mt-4">
              You are responsible for the content you create and must ensure it
              does not violate these terms or any applicable laws.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Intellectual Property
            </h2>
            <p>
              The Service and its original content (excluding user-generated
              content), features, and functionality are owned by Super Simple
              Apps and are protected by international copyright, trademark, and
              other intellectual property laws.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Disclaimer of Warranties
            </h2>
            <p>
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS
              AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR
              IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED,
              SECURE, OR ERROR-FREE.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Limitation of Liability
            </h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, SUPER SIMPLE APPS SHALL
              NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
              CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR
              REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Termination
            </h2>
            <p>
              We may terminate or suspend your access to the Service immediately,
              without prior notice, for conduct that we believe violates these
              Terms or is harmful to other users, us, or third parties.
            </p>
            <p className="mt-4">
              You may stop using the Service at any time. Upon termination, your
              right to use the Service will immediately cease.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Changes to Terms
            </h2>
            <p>
              We reserve the right to modify these terms at any time. We will
              notify users of significant changes by posting a notice on our
              website. Your continued use of the Service after changes
              constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Governing Law
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with
              the laws of Australia, without regard to its conflict of law
              provisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Contact Us
            </h2>
            <p>
              If you have any questions about these Terms, please contact us at:
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
