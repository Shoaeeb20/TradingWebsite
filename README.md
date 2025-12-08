# PaperTrade India 🇮🇳

A production-ready paper trading platform for Indian stock markets built with Next.js 14, TypeScript, MongoDB, and NextAuth.

## Features

- 🔐 **Authentication**: Email/password + Google OAuth via NextAuth
- 📊 **Real Market Data**: Delayed NSE stock prices via Yahoo Finance
- 💰 **Virtual Trading**: Start with ₹1,00,000 virtual cash
- 📈 **Order Types**: Market and limit orders with instant execution
- 🏦 **Portfolio Management**: Track holdings, P&L, and trade history
- 🏆 **Leaderboard**: Compete with other traders
- ⚡ **Trading Engine**: Transaction-safe order matching with MongoDB sessions
- 🎨 **Modern UI**: Tailwind CSS with responsive design

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB Atlas (Mongoose)
- **Auth**: NextAuth.js
- **Styling**: Tailwind CSS
- **Testing**: Vitest
- **Deployment**: Vercel

## Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (free tier works)
- Google OAuth credentials (optional)

## Local Development

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd TradingWebsite
npm install
```

### 2. Environment Setup

Create `.env.local`:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/paper-trading?retryWrites=true&w=majority
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-min-32-chars
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
INITIAL_BALANCE=100000
```

### 3. Database Setup

```bash
# Sync 100 NSE stocks to database
npm run sync-stocks

# Seed demo user and sample trades
npm run seed
```

Demo credentials:
- Email: `demo@example.com`
- Password: `demo123`

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Run Tests

```bash
npm test
```

## Project Structure

```
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── market/            # Market & stock pages
│   ├── portfolio/         # Portfolio page
│   ├── leaderboard/       # Leaderboard page
│   └── auth/              # Auth pages
├── components/            # React components
├── lib/                   # Core utilities
│   ├── db.ts             # MongoDB connection
│   ├── auth.ts           # NextAuth config
│   ├── yahoo.ts          # Yahoo Finance fetcher
│   └── tradingEngine.ts  # Order matching engine
├── models/                # Mongoose models
├── scripts/               # Utility scripts
├── tests/                 # Vitest tests
└── types/                 # TypeScript definitions
```

## Key Features Explained

### Trading Engine

The trading engine (`lib/tradingEngine.ts`) handles:
- Order validation (balance, holdings, stock existence)
- Market order instant execution
- Limit order placement and matching
- MongoDB transactions for atomic operations
- Concurrent order handling

### Price Fetching

Yahoo Finance integration (`lib/yahoo.ts`):
- Fetches delayed NSE stock prices
- 2-minute caching in MongoDB
- Retry logic with exponential backoff
- Handles rate limiting

### Order Types

1. **Market Orders**: Execute immediately at current market price
2. **Limit Orders**: Execute when price reaches specified level

## API Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/order/place` - Place order
- `POST /api/order/cancel` - Cancel pending order
- `GET /api/stocks` - List stocks
- `GET /api/stocks/price?symbol=RELIANCE` - Get stock price
- `GET /api/portfolio` - Get user portfolio
- `GET /api/trades` - Get trade history
- `GET /api/orders` - Get order history

## Deployment

See [README_DEPLOY_VERCEL.md](./README_DEPLOY_VERCEL.md) for detailed Vercel deployment instructions.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run seed` - Seed database
- `npm run sync-stocks` - Sync stock list

## Security Notes

- Never commit `.env.local` or `.env`
- Use strong `NEXTAUTH_SECRET` (min 32 characters)
- MongoDB connection uses TLS by default
- Passwords hashed with bcrypt
- API routes protected with NextAuth sessions

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

MIT License - feel free to use for personal or commercial projects.

## Support

For issues or questions, open a GitHub issue or contact the maintainers.

---

**Disclaimer**: This is a paper trading simulator for educational purposes only. No real money or broker integrations. Market data is delayed and for demonstration only.
