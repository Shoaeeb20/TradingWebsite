# Auto Square-Off Setup Guide

## How It Works

All intraday positions (long or short) are automatically closed at 3:20 PM IST daily.

## Setup Steps

### 1. Add Environment Variable

Add to your `.env.local` or Vercel environment variables:

```env
CRON_SECRET=your-random-secret-key-here
```

Generate a random secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Setup Free Cron Service

**Option A: cron-job.org (Recommended)**

1. Go to https://cron-job.org/en/
2. Sign up (free)
3. Create new cron job:
   - **Title:** PaperTrade Square-Off
   - **URL:** `https://your-app.vercel.app/api/cron/square-off`
   - **Schedule:** Daily at 15:20 (3:20 PM IST)
   - **Request Method:** GET
   - **Headers:** Add `Authorization: Bearer YOUR_CRON_SECRET`
4. Save and enable

**Option B: EasyCron**

1. Go to https://www.easycron.com/
2. Sign up (free - 1 cron job)
3. Create cron job:
   - **URL:** `https://your-app.vercel.app/api/cron/square-off`
   - **Cron Expression:** `20 15 * * *` (3:20 PM daily)
   - **HTTP Headers:** `Authorization: Bearer YOUR_CRON_SECRET`
4. Save

### 3. Test the Endpoint

```bash
curl -X GET https://your-app.vercel.app/api/cron/square-off \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

Expected response:
```json
{
  "success": true,
  "squaredOff": 5,
  "total": 5
}
```

## What Gets Squared Off

- **Long positions:** Automatically sold at market price
- **Short positions:** Automatically bought back at market price
- **Only INTRADAY:** Delivery positions are NOT affected

## Example

```
User has at 3:20 PM:
- Long: 10 RELIANCE (INTRADAY) → Auto SELL 10
- Short: -5 TCS (INTRADAY) → Auto BUY 5
- Long: 20 HDFC (DELIVERY) → NOT touched

Result:
- All intraday positions closed
- P&L calculated and added to balance
- Delivery positions remain
```

## Timezone Note

Make sure your cron service is set to **IST (UTC+5:30)** or adjust the time accordingly.

## Vercel Free Tier

✅ This solution works on **Vercel Free Tier**
✅ No paid Vercel Pro plan needed
✅ Uses external free cron service
✅ API endpoint is serverless (free)

## Monitoring

Check cron job execution logs in your cron service dashboard to ensure it runs daily.
