import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Disclaimer - PaperTrade India',
  description: 'Important disclaimers and risk warnings for PaperTrade India virtual trading platform',
}

export default function Disclaimer() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Disclaimer</h1>
      <p className="text-gray-600 mb-8">Last updated: December 18, 2025</p>

      <div className="prose prose-lg max-w-none">
        <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8">
          <h2 className="text-xl font-bold text-red-800 mb-2">⚠️ Important Notice</h2>
          <p className="text-red-700">
            PaperTrade India is a virtual trading simulation platform for educational purposes only. 
            No real money is involved in any transactions on this platform.
          </p>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">1. Educational Purpose Only</h2>
          <p className="mb-4">
            PaperTrade India is designed solely for educational and simulation purposes. The platform allows users to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Learn trading concepts and strategies</li>
            <li>Practice with virtual money</li>
            <li>Understand market dynamics</li>
            <li>Build trading confidence</li>
          </ul>
          <p className="mb-4">
            <strong>This platform does NOT constitute financial advice, investment recommendations, or professional guidance.</strong>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">2. No Real Money Involved</h2>
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4">
            <p className="text-yellow-800">
              <strong>All trading on PaperTrade India is virtual:</strong>
            </p>
            <ul className="list-disc pl-6 mt-2 text-yellow-800">
              <li>Starting balance of ₹1,00,000 is virtual money</li>
              <li>All profits and losses are simulated</li>
              <li>No real money can be deposited or withdrawn</li>
              <li>Virtual gains cannot be converted to real money</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">3. Market Data and Accuracy</h2>
          <p className="mb-4">
            While we strive to provide accurate market data:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Stock prices may have slight delays</li>
            <li>Data is sourced from third-party providers</li>
            <li>We cannot guarantee 100% accuracy or real-time data</li>
            <li>System downtime may occur for maintenance</li>
            <li>Market data is for simulation purposes only</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">4. Investment Risks</h2>
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-4">
            <p className="text-red-800 mb-2">
              <strong>Real stock market trading involves significant risks:</strong>
            </p>
            <ul className="list-disc pl-6 text-red-800">
              <li>You can lose all or part of your investment</li>
              <li>Past performance does not guarantee future results</li>
              <li>Market volatility can cause rapid price changes</li>
              <li>Economic factors can affect stock prices</li>
              <li>Individual company risks may impact investments</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">5. No Financial Advice</h2>
          <p className="mb-4">
            PaperTrade India and its creators:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Do not provide investment advice or recommendations</li>
            <li>Are not licensed financial advisors or brokers</li>
            <li>Do not endorse any particular investment strategy</li>
            <li>Cannot be held responsible for real trading decisions</li>
          </ul>
          <p className="mb-4">
            <strong>Always consult with qualified financial professionals before making real investment decisions.</strong>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">6. Platform Limitations</h2>
          <p className="mb-4">
            Users should be aware that:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Simulation results may not reflect real trading conditions</li>
            <li>Real trading involves emotions, fees, and slippage not simulated here</li>
            <li>Market liquidity and execution may differ in real trading</li>
            <li>Tax implications are not considered in simulations</li>
            <li>Brokerage fees and charges are not included</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">7. User Responsibility</h2>
          <p className="mb-4">
            By using PaperTrade India, you acknowledge that:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>You understand this is a simulation platform</li>
            <li>You will not rely on this platform for real investment decisions</li>
            <li>You will seek professional advice for actual trading</li>
            <li>You use the platform at your own risk</li>
            <li>You are responsible for your own learning and decisions</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">8. Limitation of Liability</h2>
          <p className="mb-4">
            PaperTrade India, its creators, and affiliates shall not be liable for:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Any losses incurred in real trading based on platform experience</li>
            <li>Data inaccuracies or system downtime</li>
            <li>Investment decisions made by users</li>
            <li>Any direct, indirect, or consequential damages</li>
            <li>Loss of profits or business opportunities</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">9. Regulatory Compliance</h2>
          <p className="mb-4">
            PaperTrade India:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Is not a registered investment advisor</li>
            <li>Is not a licensed brokerage firm</li>
            <li>Does not facilitate real securities transactions</li>
            <li>Operates as an educational simulation platform only</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">10. Age Restriction</h2>
          <p className="mb-4">
            This platform is intended for users who are 18 years or older. Users under 18 should use the platform only under adult supervision and guidance.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">11. Changes to Disclaimer</h2>
          <p className="mb-4">
            We reserve the right to update this disclaimer at any time. Users will be notified of significant changes.
          </p>
        </section>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mt-8">
          <h2 className="text-xl font-bold text-blue-800 mb-2">💡 Remember</h2>
          <p className="text-blue-700">
            The goal of PaperTrade India is to help you learn and practice trading in a risk-free environment. 
            Use this knowledge responsibly when you decide to enter real markets.
          </p>
        </div>

        <section className="mb-8 mt-8">
          <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
          <p className="mb-4">
            If you have any questions about this disclaimer, please contact us at:
          </p>
          <p className="mb-4">
            Email: <a href="mailto:osman.shoaeeb@gmail.com" className="text-blue-600 hover:underline">osman.shoaeeb@gmail.com</a>
          </p>
        </section>
      </div>
    </div>
  )
}