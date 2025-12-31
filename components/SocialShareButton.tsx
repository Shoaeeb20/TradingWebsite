'use client'

import { useState } from 'react'

interface SocialShareButtonProps {
  achievement?: {
    title: string
    description: string
    icon: string
  }
  trade?: {
    symbol: string
    profit: number
    amount: number
  }
  milestone?: {
    type: 'trades' | 'profit' | 'streak'
    value: number
  }
  type: 'achievement' | 'trade' | 'milestone'
}

export default function SocialShareButton({ achievement, trade, milestone, type }: SocialShareButtonProps) {
  const [showOptions, setShowOptions] = useState(false)
  const [copied, setCopied] = useState(false)

  const generateShareText = () => {
    const baseUrl = 'https://papertrade-india.vercel.app'
    
    switch (type) {
      case 'achievement':
        return `🏆 Just unlocked "${achievement?.title}" on PaperTrade India! ${achievement?.description} Join me in virtual trading: ${baseUrl}`
      
      case 'trade':
        const profitText = trade?.profit && trade.profit > 0 ? `+₹${trade.profit.toLocaleString()}` : `₹${trade?.profit?.toLocaleString()}`
        return `📈 Just made a ${profitText} profit trading ${trade?.symbol} on PaperTrade India! Practice your trading skills risk-free: ${baseUrl}`
      
      case 'milestone':
        let milestoneText = ''
        if (milestone?.type === 'trades') {
          milestoneText = `Completed ${milestone.value} trades`
        } else if (milestone?.type === 'profit') {
          milestoneText = `Reached ₹${milestone.value.toLocaleString()} total profit`
        } else if (milestone?.type === 'streak') {
          milestoneText = `${milestone.value} day trading streak`
        }
        return `🎯 Milestone achieved: ${milestoneText} on PaperTrade India! Start your virtual trading journey: ${baseUrl}`
      
      default:
        return `🚀 Join me on PaperTrade India - India's best virtual trading platform! ${baseUrl}`
    }
  }

  const shareText = generateShareText()

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`
    window.open(twitterUrl, '_blank', 'width=550,height=420')
  }

  const handleLinkedInShare = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://papertrade-india.vercel.app')}&summary=${encodeURIComponent(shareText)}`
    window.open(linkedinUrl, '_blank', 'width=550,height=420')
  }

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleTelegramShare = () => {
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent('https://papertrade-india.vercel.app')}&text=${encodeURIComponent(shareText)}`
    window.open(telegramUrl, '_blank')
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
      >
        <span>📤</span>
        Share
      </button>

      {showOptions && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowOptions(false)}
          />
          
          {/* Share Options */}
          <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-xl border p-4 z-20 min-w-[250px]">
            <h4 className="font-semibold text-gray-900 mb-3">Share your success!</h4>
            
            {/* Preview Text */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm text-gray-700">
              {shareText.substring(0, 100)}...
            </div>

            {/* Share Buttons */}
            <div className="space-y-2">
              <button
                onClick={handleTwitterShare}
                className="w-full flex items-center gap-3 p-2 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-white text-sm">
                  🐦
                </div>
                <span className="text-gray-900">Share on Twitter</span>
              </button>

              <button
                onClick={handleLinkedInShare}
                className="w-full flex items-center gap-3 p-2 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm">
                  💼
                </div>
                <span className="text-gray-900">Share on LinkedIn</span>
              </button>

              <button
                onClick={handleWhatsAppShare}
                className="w-full flex items-center gap-3 p-2 hover:bg-green-50 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">
                  💬
                </div>
                <span className="text-gray-900">Share on WhatsApp</span>
              </button>

              <button
                onClick={handleTelegramShare}
                className="w-full flex items-center gap-3 p-2 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                  ✈️
                </div>
                <span className="text-gray-900">Share on Telegram</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white text-sm">
                  {copied ? '✓' : '📋'}
                </div>
                <span className="text-gray-900">
                  {copied ? 'Copied!' : 'Copy Link'}
                </span>
              </button>
            </div>

            <div className="mt-3 pt-3 border-t text-xs text-gray-500 text-center">
              Help grow our trading community! 🚀
            </div>
          </div>
        </>
      )}
    </div>
  )
}