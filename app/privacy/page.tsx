export default function PrivacyPolicyPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          Privacy Policy
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Last Updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>
      </div>

      <div className="prose prose-invert prose-blue max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-white">1. Introduction</h2>
          <p className="text-gray-300">
            Welcome to X1 Sports. We respect your privacy and are committed to protecting your personal data. This
            privacy policy will inform you about how we look after your personal data when you visit our website and
            tell you about your privacy rights and how the law protects you.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-white">2. The Data We Collect</h2>
          <p className="text-gray-300">
            We may collect, use, store and transfer different kinds of personal data about you which we have grouped
            together as follows:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-300">
            <li>
              <strong className="text-white">Identity Data</strong> includes first name, last name, username or similar
              identifier, and date of birth.
            </li>
            <li>
              <strong className="text-white">Contact Data</strong> includes email address and telephone numbers.
            </li>
            <li>
              <strong className="text-white">Technical Data</strong> includes internet protocol (IP) address, your login
              data, browser type and version, time zone setting and location, browser plug-in types and versions,
              operating system and platform, and other technology on the devices you use to access this website.
            </li>
            <li>
              <strong className="text-white">Profile Data</strong> includes your username and password, your interests,
              preferences, feedback, and survey responses.
            </li>
            <li>
              <strong className="text-white">Usage Data</strong> includes information about how you use our website,
              products, and services.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-white">3. How We Use Your Data</h2>
          <p className="text-gray-300">
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data
            in the following circumstances:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-300">
            <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
            <li>
              Where it is necessary for our legitimate interests (or those of a third party) and your interests and
              fundamental rights do not override those interests.
            </li>
            <li>Where we need to comply with a legal obligation.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-white">4. Data Security</h2>
          <p className="text-gray-300">
            We have put in place appropriate security measures to prevent your personal data from being accidentally
            lost, used, or accessed in an unauthorized way, altered, or disclosed. In addition, we limit access to your
            personal data to those employees, agents, contractors, and other third parties who have a business need to
            know.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-white">5. Data Retention</h2>
          <p className="text-gray-300">
            We will only retain your personal data for as long as reasonably necessary to fulfill the purposes we
            collected it for, including for the purposes of satisfying any legal, regulatory, tax, accounting, or
            reporting requirements.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-white">6. Your Legal Rights</h2>
          <p className="text-gray-300">
            Under certain circumstances, you have rights under data protection laws in relation to your personal data,
            including the right to:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-300">
            <li>Request access to your personal data.</li>
            <li>Request correction of your personal data.</li>
            <li>Request erasure of your personal data.</li>
            <li>Object to processing of your personal data.</li>
            <li>Request restriction of processing your personal data.</li>
            <li>Request transfer of your personal data.</li>
            <li>Right to withdraw consent.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-white">7. Contact Us</h2>
          <p className="text-gray-300">
            If you have any questions about this privacy policy or our privacy practices, please contact us at:
          </p>
          <p className="mt-4 text-blue-400">info@myx1sports.com</p>
        </section>
      </div>
    </main>
  )
}
