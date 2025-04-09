export default function TermsOfServicePage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          Terms of Service
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Last Updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>
      </div>

      <div className="prose prose-invert prose-blue max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-white">1. Agreement to Terms</h2>
          <p className="text-gray-300">
            By accessing or using the X1 Sports platform, you agree to be bound by these Terms of Service and all
            applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using
            or accessing this site.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-white">2. Use License</h2>
          <p className="text-gray-300">
            Permission is granted to temporarily download one copy of the materials on X1 Sports's website for personal,
            non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under
            this license you may not:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-300">
            <li>Modify or copy the materials;</li>
            <li>Use the materials for any commercial purpose, or for any public display;</li>
            <li>Attempt to decompile or reverse engineer any software contained on X1 Sports's website;</li>
            <li>Remove any copyright or other proprietary notations from the materials; or</li>
            <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-white">3. User Accounts</h2>
          <p className="text-gray-300">
            When you create an account with us, you must provide information that is accurate, complete, and current at
            all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of
            your account on our platform.
          </p>
          <p className="text-gray-300 mt-4">
            You are responsible for safeguarding the password that you use to access the platform and for any activities
            or actions under your password. You agree not to disclose your password to any third party. You must notify
            us immediately upon becoming aware of any breach of security or unauthorized use of your account.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-white">4. User Content</h2>
          <p className="text-gray-300">
            Our platform allows you to post, link, store, share and otherwise make available certain information, text,
            graphics, videos, or other material. You are responsible for the content that you post, including its
            legality, reliability, and appropriateness.
          </p>
          <p className="text-gray-300 mt-4">
            By posting content on our platform, you grant us the right to use, reproduce, modify, perform, display,
            distribute, and otherwise disclose to third parties any such material according to your account settings.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-white">5. Prohibited Activities</h2>
          <p className="text-gray-300">
            You may not access or use the platform for any purpose other than that for which we make the platform
            available. The platform may not be used in connection with any commercial endeavors except those that are
            specifically endorsed or approved by us.
          </p>
          <p className="text-gray-300 mt-4">As a user of the platform, you agree not to:</p>
          <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-300">
            <li>
              Systematically retrieve data or other content from the platform to create or compile, directly or
              indirectly, a collection, compilation, database, or directory without written permission from us.
            </li>
            <li>
              Make any unauthorized use of the platform, including collecting usernames and/or email addresses of users
              by electronic or other means for the purpose of sending unsolicited email, or creating user accounts by
              automated means or under false pretenses.
            </li>
            <li>Use the platform to advertise or offer to sell goods and services.</li>
            <li>Circumvent, disable, or otherwise interfere with security-related features of the platform.</li>
            <li>Engage in unauthorized framing of or linking to the platform.</li>
            <li>
              Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account
              information such as user passwords.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-white">6. Limitation of Liability</h2>
          <p className="text-gray-300">
            In no event shall X1 Sports, nor its directors, employees, partners, agents, suppliers, or affiliates, be
            liable for any indirect, incidental, special, consequential or punitive damages, including without
            limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to
            or use of or inability to access or use the platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-white">7. Governing Law</h2>
          <p className="text-gray-300">
            These Terms shall be governed and construed in accordance with the laws of the United States, without regard
            to its conflict of law provisions.
          </p>
          <p className="text-gray-300 mt-4">
            Our failure to enforce any right or provision of these Terms will not be considered a waiver of those
            rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining
            provisions of these Terms will remain in effect.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-white">8. Changes to Terms</h2>
          <p className="text-gray-300">
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is
            material we will try to provide at least 30 days' notice prior to any new terms taking effect. What
            constitutes a material change will be determined at our sole discretion.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-white">9. Contact Us</h2>
          <p className="text-gray-300">If you have any questions about these Terms, please contact us at:</p>
          <p className="mt-4 text-blue-400">info@myx1sports.com</p>
        </section>
      </div>
    </main>
  )
}
