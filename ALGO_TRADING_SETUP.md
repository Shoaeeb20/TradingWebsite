# 🤖 Algorithmic Trading Setup Guide

## Overview

This guide covers the setup and configuration of the Moving Average Crossover algorithmic trading feature for PaperTrade India.

## ⚠️ Important Disclaimers

- **Educational Purpose Only**: This is a paper trading simulator for learning
- **No Real Money**: All trades are virtual and simulated
- **Not Financial Advice**: This system provides educational content only
- **SEBI Compliance**: Platform is not SEBI registered - educational use only

## 🔧 Environment Setup

### Required Environment Variables

Add these to your `.env` file:

```bash
# Existing variables (keep these)
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
MONGODB_URI=your-mongodb-connection-string

# New variable for algo trading cron security
CRON_SECRET=your-secure-random-string-here
```

### Generate CRON_SECRET

```bash
# Generate a secure random string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🚀 Features Implemented

### 1. Moving Average Crossover Strategy
- **Strategy**: 20-period MA vs 50-period MA crossover
- **Signals**: BUY when short MA crosses above long MA, SELL when below
- **Position Management**: One position per symbol maximum
- **Execution**: Paper trading only with virtual money

### 2. Paywall Integration
- **Free Users**: View-only access, educational content
- **Pro Users (₹199/month)**: Full algo execution, parameter customization
- **Subscription Check**: Validates before every execution

### 3. Market Hours Safety
- **Market Validation**: Checks Indian market hours (9:15 AM - 3:30 PM IST)
- **Weekend Protection**: No execution on weekends
- **Holiday Awareness**: Respects market closure days

### 4. Cron Integration
- **Secure Endpoint**: `/api/algo/execute?secret=YOUR_CRON_SECRET`
- **Scheduled Execution**: Runs every 5 minutes during market hours
- **Error Handling**: Comprehensive logging and error recovery

## 📊 Database Models

### New Collections Created

1. **AlgoStrategy**: User's algorithm configurations
2. **AlgoRun**: Execution logs and performance tracking
3. **Trade/Order Updates**: Added `source` field for tracking

### Data Flow

```
User Config → Strategy Validation → Market Check → Signal Generation → Order Placement → Trade Execution → Performance Tracking
```

## 🔗 API Endpoints

### User Endpoints
- `GET /api/algo/strategy` - Get user's strategy configuration
- `PUT /api/algo/strategy` - Update strategy settings
- `POST /api/algo/strategy` - Manual execution trigger (Pro only)

### Cron Endpoint
- `GET /api/algo/execute?secret=CRON_SECRET` - Automated execution

## 🎯 User Interface

### New Page: `/algo-trading`
- Strategy configuration and monitoring
- Performance metrics and P&L tracking
- Educational content and disclaimers
- Subscription upgrade prompts for free users

### Navigation
- Added "Algo Trading" link to main navigation
- Mobile-responsive menu integration

## ⏰ Cron Job Setup

### Using cron-job.org

1. Visit [cron-job.org](https://cron-job.org)
2. Create account and new cron job
3. Set URL: `https://yourdomain.com/api/algo/execute?secret=YOUR_CRON_SECRET`
4. Schedule: Every 5 minutes during market hours
5. Time zone: Asia/Kolkata (IST)

### Recommended Schedule
```
# Every 5 minutes from 9:15 AM to 3:30 PM IST, Monday-Friday
*/5 9-15 * * 1-5
```

## 🛡️ Security Features

### Access Control
- Subscription validation before execution
- Market hours enforcement
- Secure cron endpoint with secret verification
- User authentication for all strategy operations

### Error Handling
- Comprehensive logging of all operations
- Graceful failure handling with rollback
- Market closure detection and skipping
- Insufficient balance protection

## 📈 Performance Monitoring

### Metrics Tracked
- Total trades executed
- Win/loss ratios
- Virtual P&L performance
- Execution success rates
- Market timing compliance

### Logging
- All executions logged in `AlgoRun` collection
- Detailed error messages and stack traces
- Performance timing for optimization

## 🔧 Maintenance

### Regular Tasks
1. Monitor cron job execution logs
2. Review user subscription status
3. Check market hours configuration
4. Validate strategy performance metrics

### Troubleshooting
- Check `AlgoRun` collection for execution logs
- Verify market hours function accuracy
- Validate subscription service integration
- Monitor database performance with new collections

## 📚 Educational Content

### Strategy Explanation
The Moving Average Crossover strategy is included as educational content:
- Clear explanation of how moving averages work
- Visual representation of crossover signals
- Risk disclaimers and educational focus
- Performance expectations and limitations

### Compliance Messaging
All UI includes appropriate disclaimers:
- "Educational purpose only"
- "No real money involved"
- "Not financial advice"
- "Past performance doesn't guarantee future results"

## 🚀 Deployment Checklist

- [ ] Environment variables configured
- [ ] Database models deployed
- [ ] Cron job scheduled
- [ ] Subscription system tested
- [ ] Market hours validation working
- [ ] UI/UX tested on mobile and desktop
- [ ] Error handling verified
- [ ] Performance monitoring active

## 📞 Support

For technical issues:
1. Check execution logs in `AlgoRun` collection
2. Verify environment variables
3. Test market hours function
4. Validate subscription status
5. Review cron job execution logs

---

**Remember**: This is an educational paper trading system. No real money is involved, and this is not financial advice.