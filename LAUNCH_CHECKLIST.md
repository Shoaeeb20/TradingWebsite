# 🚀 Launch Checklist

Complete this checklist before launching PaperTrade India to production.

## Pre-Launch (Development)

- [ ] **1. Install Dependencies**
  ```bash
  npm install
  ```

- [ ] **2. Configure Environment Variables**
  - Create `.env.local` from `.env.example`
  - Set `MONGODB_URI` with your MongoDB Atlas connection string
  - Generate and set `NEXTAUTH_SECRET` (min 32 characters)
  - Set `NEXTAUTH_URL=http://localhost:3000`
  - (Optional) Configure Google OAuth credentials

- [ ] **3. Initialize Database**
  ```bash
  npm run sync-stocks  # Import 100 NSE stocks
  npm run seed         # Create demo user and sample data
  ```

- [ ] **4. Test Locally**
  ```bash
  npm run dev
  ```
  - Visit http://localhost:3000
  - Sign up with new account
  - Sign in with demo account (demo@example.com / demo123)
  - Place market order
  - Place limit order
  - Cancel pending order
  - Check portfolio updates
  - Verify leaderboard

- [ ] **5. Run Tests**
  ```bash
  npm test
  npm run lint
  ```

## Production Deployment

- [ ] **6. Push to GitHub**
  ```bash
  git init
  git add .
  git commit -m "Initial commit"
  git push origin main
  ```

- [ ] **7. Deploy to Vercel**
  - Import GitHub repository to Vercel
  - Configure environment variables (see README_DEPLOY_VERCEL.md)
  - Deploy and verify build succeeds

- [ ] **8. Configure Production Database**
  - Whitelist Vercel IPs in MongoDB Atlas (0.0.0.0/0)
  - Run `npm run sync-stocks` with production MONGODB_URI
  - Verify database indexes are created

- [ ] **9. Test Production Deployment**
  - Sign up with real email
  - Test Google OAuth (if configured)
  - Place orders and verify execution
  - Check all pages load correctly
  - Test on mobile device

- [ ] **10. Monitor and Optimize**
  - Enable Vercel Analytics
  - Set up MongoDB Atlas alerts
  - Monitor error logs for first 24 hours
  - Check API response times
  - Verify price caching works

## Post-Launch

- [ ] Share on social media
- [ ] Add custom domain (optional)
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Create user documentation
- [ ] Plan feature roadmap

---

## Quick Start Commands

```bash
# Development
npm install
npm run sync-stocks
npm run seed
npm run dev

# Testing
npm test
npm run lint

# Production
npm run build
npm start
```

## Demo Credentials

- **Email**: demo@example.com
- **Password**: demo123
- **Balance**: ₹100,000

## Support Checklist

- [ ] README.md is complete and accurate
- [ ] API documentation is clear
- [ ] Error messages are user-friendly
- [ ] Loading states are implemented
- [ ] Mobile responsive design verified

---

**Estimated Setup Time**: 30-45 minutes
**Estimated Launch Time**: 15-20 minutes

Good luck with your launch! 🎉
