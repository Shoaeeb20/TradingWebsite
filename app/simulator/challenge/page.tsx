'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const STOCKS = [
  'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'HINDUNILVR', 'ITC', 'SBIN',
  'BHARTIARTL', 'KOTAKBANK', 'LT', 'AXISBANK', 'ASIANPAINT', 'MARUTI', 'TITAN',
  'SUNPHARMA', 'ULTRACEMCO', 'BAJFINANCE', 'NESTLEIND', 'WIPRO'
]

const ALL_EVENTS = [
  { label: 'Bad Earnings', impact: 'DOWN' },
  { label: 'CEO Resignation', impact: 'DOWN' },
  { label: 'Fraud Allegation', impact: 'DOWN' },
  { label: 'RBI Rate Hike', impact: 'DOWN' },
  { label: 'Poor Guidance', impact: 'DOWN' },
  { label: 'Major Lawsuit', impact: 'DOWN' },
  { label: 'Cyberattack', impact: 'DOWN' },
  { label: 'Profit Warning', impact: 'DOWN' },
  { label: 'Big Order Received', impact: 'UP' },
  { label: 'Strong Earnings', impact: 'UP' },
  { label: 'Star CEO Hired', impact: 'UP' },
  { label: 'RBI Rate Cut', impact: 'UP' },
  { label: 'Product Launch', impact: 'UP' },
  { label: 'Global Partnership', impact: 'UP' },
  { label: 'Expansion Plan', impact: 'UP' },
  { label: 'Strong Guidance', impact: 'UP' }
]

export default function ChallengePage() {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle')
  const [timeLeft, setTimeLeft] = useState(60)
  const [currentRound, setCurrentRound] = useState(0)
  const [score, setScore] = useState(0)
  const [currentScenario, setCurrentScenario] = useState<any>(null)
  const [answered, setAnswered] = useState(false)
  const [lastAnswer, setLastAnswer] = useState<'correct' | 'wrong' | null>(null)

  const generateScenario = () => {
    const stock = STOCKS[Math.floor(Math.random() * STOCKS.length)]
    const event = ALL_EVENTS[Math.floor(Math.random() * ALL_EVENTS.length)]
    return { stock, event }
  }

  const startGame = () => {
    setGameState('playing')
    setTimeLeft(60)
    setCurrentRound(1)
    setScore(0)
    setCurrentScenario(generateScenario())
    setAnswered(false)
    setLastAnswer(null)
  }

  const handleAnswer = (answer: 'UP' | 'DOWN') => {
    if (answered) return

    const correct = answer === currentScenario.event.impact
    setAnswered(true)
    setLastAnswer(correct ? 'correct' : 'wrong')
    
    if (correct) {
      setScore(score + 10)
    }

    setTimeout(() => {
      if (currentRound < 10 && timeLeft > 0) {
        setCurrentRound(currentRound + 1)
        setCurrentScenario(generateScenario())
        setAnswered(false)
        setLastAnswer(null)
      } else if (currentRound >= 10 || timeLeft <= 0) {
        setGameState('finished')
      }
    }, 1000)
  }

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            setGameState('finished')
            return 0
          }
          return t - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [gameState, timeLeft])

  const getScoreMessage = () => {
    if (score >= 80) return { emoji: '🏆', text: 'Market Genius!', color: 'text-yellow-600' }
    if (score >= 60) return { emoji: '🎯', text: 'Expert Trader!', color: 'text-green-600' }
    if (score >= 40) return { emoji: '📈', text: 'Good Instincts!', color: 'text-blue-600' }
    if (score >= 20) return { emoji: '📊', text: 'Keep Learning!', color: 'text-purple-600' }
    return { emoji: '📉', text: 'Practice More!', color: 'text-gray-600' }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <p className="text-sm text-yellow-700">
          <strong>Educational Game:</strong> Test your market instincts! For real trading, visit <Link href="/market" className="underline font-semibold">Market</Link>.
        </p>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">⚡ 60-Second Challenge</h1>
        <p className="text-gray-600">Predict market reactions as fast as you can!</p>
      </div>

      {gameState === 'idle' && (
        <div className="card text-center max-w-2xl mx-auto">
          <div className="text-6xl mb-4">🎮</div>
          <h2 className="text-2xl font-bold mb-4">How to Play</h2>
          <div className="text-left space-y-3 mb-6">
            <p className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">1.</span>
              <span>You'll see a stock and a news event</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">2.</span>
              <span>Predict: Will the price go UP 📈 or DOWN 📉?</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">3.</span>
              <span>Answer 10 questions in 60 seconds</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">4.</span>
              <span>Each correct answer = 10 points</span>
            </p>
          </div>
          <button onClick={startGame} className="btn btn-primary text-lg px-8 py-3">
            🚀 Start Challenge
          </button>
        </div>
      )}

      {gameState === 'playing' && currentScenario && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-blue-600">
              Round {currentRound}/10
            </div>
            <div className={`text-3xl font-bold ${timeLeft <= 10 ? 'text-red-600 animate-pulse' : 'text-gray-700'}`}>
              ⏱️ {timeLeft}s
            </div>
            <div className="text-2xl font-bold text-green-600">
              Score: {score}
            </div>
          </div>

          <div className="card">
            <div className="text-center space-y-6">
              <div>
                <div className="text-sm text-gray-500 mb-2">Stock</div>
                <div className="text-4xl font-bold text-blue-600">{currentScenario.stock}</div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">Breaking News</div>
                <div className="text-2xl font-bold">{currentScenario.event.label}</div>
              </div>

              <div className="text-xl font-semibold text-gray-700">
                Will the price go UP or DOWN?
              </div>

              {!answered ? (
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  <button
                    onClick={() => handleAnswer('UP')}
                    className="py-6 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-2xl transition-all hover:scale-105"
                  >
                    📈 UP
                  </button>
                  <button
                    onClick={() => handleAnswer('DOWN')}
                    className="py-6 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-2xl transition-all hover:scale-105"
                  >
                    📉 DOWN
                  </button>
                </div>
              ) : (
                <div className={`text-3xl font-bold ${lastAnswer === 'correct' ? 'text-green-600' : 'text-red-600'}`}>
                  {lastAnswer === 'correct' ? '✅ Correct! +10' : '❌ Wrong!'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {gameState === 'finished' && (
        <div className="card text-center max-w-2xl mx-auto">
          <div className="text-6xl mb-4">{getScoreMessage().emoji}</div>
          <h2 className={`text-3xl font-bold mb-2 ${getScoreMessage().color}`}>
            {getScoreMessage().text}
          </h2>
          <div className="text-5xl font-bold text-blue-600 mb-6">
            {score} / 100
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6 text-left">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Questions Answered</div>
              <div className="text-2xl font-bold">{currentRound}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Accuracy</div>
              <div className="text-2xl font-bold">{currentRound > 0 ? Math.round((score / (currentRound * 10)) * 100) : 0}%</div>
            </div>
          </div>

          <div className="space-y-3">
            <button onClick={startGame} className="btn btn-primary w-full text-lg">
              🔄 Play Again
            </button>
            <Link href="/simulator" className="block w-full py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
              ← Back to Simulator
            </Link>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>Tip:</strong> The more you play, the better you'll understand market psychology!
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
