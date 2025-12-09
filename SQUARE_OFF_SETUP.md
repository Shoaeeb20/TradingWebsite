# Intraday Square-Off Setup Guide

## Overview

The platform now supports automatic square-off of INTRADAY positions at 3:20 PM IST daily (Monday-Friday).

## How It Works

1. **Product Types**:
   - **INTRADAY**: Positions automatically squared off at 3:20 PM IST
   - **DELIVERY**: Positions held indefinitely until manually closed

2. **Square-Off Process**:
   - Runs daily at 3:20 PM IST (9:50 AM UTC)
   - Finds all INTRADAY holdings
   - Places market orders to close positions
   - Calculates P&L and updates user balance
   - Creates trade records for audit

3. **Short Positions**:
   - INTRADAY short selling is allowed
   - Short positions are covered (bought back) during square-off
   - DELIVERY short selling is blocked

## Vercel Deployment Setup

### 1. Add Environment Variable

In Vercel dashboard, add:

```
CRON_SECRET=<generate-random-secret>
```

Generate secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 2. Vercel Cron Configuration

The `vercel.json` file is already configured:

```json
{
  "crons": [
    {
      "path": "/api/cron/square-off",
      "schedule": "50 9 * * 1-5"
    }
  ]
}
```

**Schedule**: `50 9 * * 1-5`
- Runs at 9:50 AM UTC = 3:20 PM IST
- Monday to Friday only
- Automatically skips weekends

### 3. Deploy to Vercel

```bash
git add .
git commit -m "Add intraday square-off feature"
git push origin main
```

Vercel will automatically:
- Detect `vercel.json`
- Set up the cron job
- Run it daily at scheduled time

## Local Testing

Test the square-off endpoint locally:

```bash
# Start dev server
npm run dev

# In another terminal, trigger square-off
curl -X GET http://localhost:3000/api/cron/square-off \
  -H "Authorization: Bearer your-cron-secret"
```

## API Endpoint

**GET** `/api/cron/square-off`

**Headers**:
```
Authorization: Bearer <CRON_SECRET>
```

**Response**:
```json
{
  "message": "Square-off completed",
  "squaredOff": 5,
  "total": 5,
  "errors": []
}
```

## Database Changes

### Holding Model
Added `productType` field:
```typescript
{
  productType: 'INTRADAY' | 'DELIVERY'  // Default: 'DELIVERY'
}
```

### Index Updated
```typescript
{ userId: 1, symbol: 1, productType: 1 }  // Unique compound index
```

## User Experience

### Trade Form
- Users select INTRADAY or DELIVERY when placing orders
- Button shows: "Place BUY Order (INTRADAY)"

### Portfolio Page
- Holdings show product type badge
- INTRADAY positions have blue badge
- DELIVERY positions have green badge
- Short positions show negative quantity with (SHORT) label

### Square-Off Notification
- Positions automatically closed at 3:20 PM IST
- P&L realized and added to balance
- Trade history shows square-off trades

## Monitoring

### Check Cron Logs in Vercel

1. Go to Vercel Dashboard
2. Select your project
3. Click "Deployments"
4. Click on latest deployment
5. Go to "Functions" tab
6. Find `/api/cron/square-off`
7. View execution logs

### Manual Trigger (Emergency)

If cron fails, manually trigger via Vercel dashboard or:

```bash
curl -X GET https://your-app.vercel.app/api/cron/square-off \
  -H "Authorization: Bearer <CRON_SECRET>"
```

## Cost Impact

**Vercel Hobby Plan**:
- ✅ Cron jobs included
- ✅ 1 execution per day = 22/month
- ✅ ~2-5 seconds execution time
- ✅ Negligible bandwidth (~100 KB/day)

**Total monthly cost**: $0 (within free tier)

## Troubleshooting

### Cron Not Running

1. Check `vercel.json` is in root directory
2. Verify `CRON_SECRET` is set in Vercel env vars
3. Check Vercel deployment logs
4. Ensure schedule is correct (UTC time)

### Square-Off Failed

1. Check function logs in Vercel
2. Verify MongoDB connection
3. Check Yahoo Finance API availability
4. Manually trigger to test

### Wrong Time Zone

Schedule is in UTC. To adjust:
- 3:20 PM IST = 9:50 AM UTC
- 3:30 PM IST = 10:00 AM UTC
- Use: https://www.worldtimebuddy.com/

## Security

- Endpoint protected by `CRON_SECRET`
- Only Vercel cron can call it
- No public access
- Logs all executions

## Future Enhancements

- Email notification before square-off
- SMS alerts for large positions
- Configurable square-off time
- Holiday calendar integration
- Square-off preview dashboard

---

**Status**: ✅ Production Ready

**Last Updated**: 2024
