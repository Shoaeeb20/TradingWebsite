import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - PaperTrade India',
  description: 'Privacy Policy for PaperTrade India - How we collect, use, and protect your data',
}

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      <p className="text-gray-600 mb-8">Last updated: December 18, 2025</p>

      <div className="prose prose-lg max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
          <p className="mb-4">
            At PaperTrade India, we collect information to provide you with a better trading simulation experience:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Account Information:</strong> Name, email address when you sign up</li>
            <li><strong>Trading Data:</strong> Your virtual trades, portfolio performance, and trading history</li>
            <li><strong>Usage Data:</strong> How you interact with our platform, pages visited, time spent</li>
            <li><strong>Device Information:</strong> Browser type, IP address, device identifiers</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
          <p className="mb-4">We use your information to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Provide and maintain our trading simulation service</li>
            <li>Track your virtual portfolio and trading performance</li>
            <li>Display leaderboards and rankings</li>
            <li>Send important updates about your account</li>
            <li>Improve our platform and user experience</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">3. Information Sharing</h2>
          <p className="mb-4">
            We do not sell, trade, or rent your personal information to third parties. We may share information in these limited circumstances:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>With your consent</li>
            <li>To comply with legal requirements</li>
            <li>To protect our rights and safety</li>
            <li>In connection with a business transfer</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">4. Cookies and Tracking</h2>
          <p className="mb-4">
            We use cookies and similar technologies to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Keep you logged in</li>
            <li>Remember your preferences</li>
            <li>Analyze site usage with Google Analytics</li>
            <li>Display relevant advertisements through Google AdSense</li>
          </ul>
          <p className="mb-4">
            You can control cookies through your browser settings, but some features may not work properly if disabled.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">5. Third-Party Services</h2>
          <p className="mb-4">Our platform uses third-party services:</p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Google Analytics:</strong> For website analytics and user behavior insights</li>
            <li><strong>Google AdSense:</strong> For displaying relevant advertisements</li>
            <li><strong>Yahoo Finance API:</strong> For real-time stock price data</li>
            <li><strong>NextAuth.js:</strong> For secure authentication</li>
          </ul>
          <p className="mb-4">
            These services have their own privacy policies and may collect data independently.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">6. Data Security</h2>
          <p className="mb-4">
            We implement appropriate security measures to protect your information:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Encrypted data transmission (HTTPS)</li>
            <li>Secure database storage</li>
            <li>Regular security updates</li>
            <li>Limited access to personal data</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">7. Your Rights</h2>
          <p className="mb-4">You have the right to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Delete your account and data</li>
            <li>Opt-out of marketing communications</li>
            <li>Data portability</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">8. Children's Privacy</h2>
          <p className="mb-4">
            Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">9. Changes to Privacy Policy</h2>
          <p className="mb-4">
            We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">10. Contact Us</h2>
          <p className="mb-4">
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p className="mb-4">
            Email: <a href="mailto:osman.shoaeeb@gmail.com" className="text-blue-600 hover:underline">osman.shoaeeb@gmail.com</a>
          </p>
        </section>
      </div>
    </div>
  )
}