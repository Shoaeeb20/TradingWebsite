import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - PaperTrade India',
  description: 'Terms of Service for PaperTrade India - Rules and guidelines for using our platform',
}

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      <p className="text-gray-600 mb-8">Last updated: December 18, 2025</p>

      <div className="prose prose-lg max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing and using PaperTrade India, you accept and agree to be bound by the terms and provision of this agreement.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
          <p className="mb-4">
            PaperTrade India is a virtual stock trading platform that allows users to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Practice trading with virtual money (₹1,00,000 starting balance)</li>
            <li>Trade selected NSE stocks with real market data</li>
            <li>Track portfolio performance and P&L</li>
            <li>Compete on leaderboards</li>
            <li>Learn trading strategies risk-free</li>
          </ul>
          <p className="mb-4">
            <strong>Important:</strong> This is a simulation platform for educational purposes only. No real money is involved.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">3. User Accounts</h2>
          <p className="mb-4">
            To use our service, you must:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Provide accurate and complete registration information</li>
            <li>Maintain the security of your account credentials</li>
            <li>Be responsible for all activities under your account</li>
            <li>Notify us immediately of any unauthorized use</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">4. Acceptable Use</h2>
          <p className="mb-4">You agree NOT to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Use the service for any illegal or unauthorized purpose</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Interfere with or disrupt the service</li>
            <li>Create multiple accounts to manipulate rankings</li>
            <li>Use automated tools or bots</li>
            <li>Harass or abuse other users</li>
            <li>Share your account with others</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">5. Virtual Trading Rules</h2>
          <p className="mb-4">
            Our virtual trading system operates under these rules:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Starting balance: ₹1,00,000 virtual cash</li>
            <li>Trading hours: 9:15 AM - 3:30 PM IST (NSE hours)</li>
            <li>Intraday positions auto-square off at 3:20 PM</li>
            <li>Real market data with slight delays</li>
            <li>No real money transactions</li>
            <li>Virtual profits/losses only</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">6. Intellectual Property</h2>
          <p className="mb-4">
            The service and its original content, features, and functionality are owned by PaperTrade India and are protected by international copyright, trademark, and other intellectual property laws.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">7. Disclaimers</h2>
          <p className="mb-4">
            <strong>Educational Purpose Only:</strong> This platform is for educational and simulation purposes only. It does not constitute financial advice.
          </p>
          <p className="mb-4">
            <strong>No Real Trading:</strong> No real money is involved. Virtual profits cannot be withdrawn as real money.
          </p>
          <p className="mb-4">
            <strong>Market Data:</strong> We strive for accuracy but cannot guarantee real-time data or system availability.
          </p>
          <p className="mb-4">
            <strong>No Investment Advice:</strong> We do not provide investment advice. Consult qualified professionals for real trading decisions.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">8. Limitation of Liability</h2>
          <p className="mb-4">
            PaperTrade India shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">9. Privacy</h2>
          <p className="mb-4">
            Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">10. Termination</h2>
          <p className="mb-4">
            We may terminate or suspend your account and access to the service immediately, without prior notice, for conduct that we believe violates these Terms of Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">11. Changes to Terms</h2>
          <p className="mb-4">
            We reserve the right to modify these terms at any time. We will notify users of any changes by posting the new terms on this page.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">12. Governing Law</h2>
          <p className="mb-4">
            These terms shall be governed by and construed in accordance with the laws of India.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">13. Contact Information</h2>
          <p className="mb-4">
            If you have any questions about these Terms of Service, please contact us at:
          </p>
          <p className="mb-4">
            Email: <a href="mailto:osman.shoaeeb@gmail.com" className="text-blue-600 hover:underline">osman.shoaeeb@gmail.com</a>
          </p>
        </section>
      </div>
    </div>
  )
}