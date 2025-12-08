# ⚡ Quick Reference Card

## 🚀 Essential Commands

```bash
# Setup
npm install
npm run sync-stocks
npm run seed

# Development
npm run dev              # Start dev server (http://localhost:3000)
npm test                 # Run tests
npm run lint             # Check code quality

# Production
npm run build            # Build for production
npm start                # Start production server
```

## 🔑 Demo Credentials

```
Email: demo@example.com
Password: demo123
Balance: ₹100,000
```

## 📝 Environment Variables (.env.local)

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/paper-trading
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<32-char-random-string>
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
INITIAL_BALANCE=100000
```

## 🌐 Key URLs (Local)

```
Homepage:     http://localhost:3000
Dashboard:    http://localhost:3000/dashboard
Market:       http://localhost:3000/market
Portfolio:    http://localhost:3000/portfolio
Leaderboard:  http://localhost:3000/leaderboard
Sign In:      http://localhost:3000/auth/signin
Admin:        http://localhost:3000/admin
```

## 📡 API Endpoints

```
POST   /api/auth/signup              # Register user
POST   /api/order/place              # Place order
POST   /api/order/cancel             # Cancel order
GET    /api/stocks                   # List stocks
GET    /api/stocks/price?symbol=TCS  # Get price
GET    /api/portfolio                # Get portfolio
GET    /api/trades                   # Get trades
GET    /api/orders                   # Get orders
```

## 🗂️ Project Structure

```
app/          → Pages & API routes
components/   → React components
lib/          → Core utilities
models/       → Database models
scripts/      → Utility scripts
tests/        → Test files
```

## 🎯 Common Tasks

### Add New Stock
```typescript
// In scripts/syncStocks.ts
{ symbol: 'NEWSYMBOL', name: 'New Company Ltd', sector: 'IT' }
```

### Create New User
```bash
# Via UI: http://localhost:3000/auth/signin
# Or via script: Modify scripts/seed.ts
```

### Place Order (API)
```javascript
fetch('/api/order/place', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    symbol: 'RELIANCE',
    type: 'BUY',
    orderType: 'MARKET',
    quantity: 10
  })
})
```

### Get Stock Price (API)
```javascript
fetch('/api/stocks/price?symbol=TCS')
  .then(res => res.json())
  .then(data => console.log(data.price))
```

## 🐛 Troubleshooting

### MongoDB Connection Failed
```bash
# Check MONGODB_URI in .env.local
# Verify MongoDB Atlas network access (whitelist 0.0.0.0/0)
# Test connection: mongosh "your-connection-string"
```

### NextAuth Error
```bash
# Ensure NEXTAUTH_SECRET is set (min 32 chars)
# Generate: openssl rand -base64 32
# Verify NEXTAUTH_URL matches your domain
```

### Build Errors
```bash
npm run lint              # Check for errors
rm -rf .next node_modules # Clean install
npm install
npm run build
```

### Port Already in Use
```bash
# Kill process on port 3000
# Windows: netstat -ano | findstr :3000
# Linux/Mac: lsof -ti:3000 | xargs kill
```

## 📦 Dependencies

### Core
- next@14.1.0
- react@18.2.0
- typescript@5.3.3

### Database
- mongoose@8.1.0

### Auth
- next-auth@4.24.5
- bcryptjs@2.4.3

### Utilities
- axios@1.6.5
- date-fns@3.2.0
- zod@3.22.4

### Styling
- tailwindcss@3.4.1

### Testing
- vitest@1.2.1

## 🔐 Security Checklist

- [ ] Strong NEXTAUTH_SECRET (32+ chars)
- [ ] MongoDB user has minimal permissions
- [ ] Environment variables not in code
- [ ] .env.local in .gitignore
- [ ] HTTPS enabled (automatic on Vercel)

## 📊 Database Collections

```
users      → User accounts
stocks     → Stock master data
orders     → Order records
trades     → Executed trades
holdings   → Current positions
prices     → Cached prices (TTL: 2 min)
```

## 🎨 Tailwind Classes

```css
.btn              → Base button
.btn-primary      → Blue button
.btn-secondary    → Gray button
.btn-success      → Green button
.btn-danger       → Red button
.card             → White card with shadow
```

## 📱 Responsive Breakpoints

```
sm:  640px   → Small devices
md:  768px   → Medium devices
lg:  1024px  → Large devices
xl:  1280px  → Extra large devices
```

## 🧪 Test Commands

```bash
npm test                    # Run all tests
npm test -- --watch         # Watch mode
npm test -- --coverage      # Coverage report
npm test tradingEngine      # Specific test
```

## 🚀 Deployment (Vercel)

```bash
# 1. Push to GitHub
git push origin main

# 2. Import to Vercel
# Visit vercel.com → Import Project

# 3. Set Environment Variables
# Copy from .env.local to Vercel dashboard

# 4. Deploy
# Automatic on push to main
```

## 📈 Monitoring

```bash
# Vercel Dashboard
# → Analytics (page views, performance)
# → Logs (errors, warnings)
# → Deployments (history)

# MongoDB Atlas
# → Metrics (connections, operations)
# → Performance Advisor
# → Alerts
```

## 🎯 Performance Tips

- Use `lean()` for read-only queries
- Add indexes to frequently queried fields
- Cache expensive operations
- Use server components by default
- Optimize images with Next.js Image

## 📞 Quick Links

- [Next.js Docs](https://nextjs.org/docs)
- [MongoDB Docs](https://docs.mongodb.com)
- [NextAuth Docs](https://next-auth.js.org)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Vercel Docs](https://vercel.com/docs)

---

**Print this page for quick reference while developing!** 📄
