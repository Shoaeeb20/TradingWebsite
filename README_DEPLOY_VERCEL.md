# Deploying to Vercel

Complete guide to deploy PaperTrade India to Vercel.

## Prerequisites

- GitHub account
- Vercel account (free tier works)
- MongoDB Atlas cluster
- Google OAuth credentials (optional)

## Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

## Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Select the repository

## Step 3: Configure Environment Variables

In Vercel project settings, add these environment variables:

### Required Variables

```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/paper-trading?retryWrites=true&w=majority
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=<generate-a-random-32-char-string>
INITIAL_BALANCE=100000
```

### Optional Variables (for Google OAuth)

```
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

Or use: https://generate-secret.vercel.app/32

## Step 4: MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free cluster (if you haven't)
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Add `/paper-trading` before the query parameters

Example:
```
mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/paper-trading?retryWrites=true&w=majority
```

### Whitelist Vercel IPs

In MongoDB Atlas:
1. Go to "Network Access"
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (0.0.0.0/0)
   - Or add specific Vercel IPs if you prefer

## Step 5: Google OAuth Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable "Google+ API"
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Application type: "Web application"
6. Authorized redirect URIs:
   ```
   https://your-app-name.vercel.app/api/auth/callback/google
   ```
7. Copy Client ID and Client Secret to Vercel env vars

## Step 6: Deploy

1. Click "Deploy" in Vercel
2. Wait for build to complete (2-3 minutes)
3. Your app will be live at `https://your-app-name.vercel.app`

## Step 7: Initialize Database

After first deployment, run these commands locally (pointing to production DB):

```bash
# Set production MongoDB URI temporarily
export MONGODB_URI="your-production-mongodb-uri"

# Sync stocks
npm run sync-stocks

# Create demo user (optional)
npm run seed
```

Or create an admin API route to trigger these operations.

## Step 8: Custom Domain (Optional)

1. Go to Vercel project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. Update `NEXTAUTH_URL` to your custom domain

## Vercel Configuration

The project includes `next.config.js` which is automatically detected by Vercel.

### Build Settings (Auto-detected)

- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB Atlas connection string |
| `NEXTAUTH_URL` | Yes | Your app's public URL |
| `NEXTAUTH_SECRET` | Yes | Random 32+ character string |
| `INITIAL_BALANCE` | Yes | Starting virtual balance (default: 100000) |
| `GOOGLE_CLIENT_ID` | No | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth client secret |

## Troubleshooting

### Build Fails

- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript has no errors locally

### Database Connection Fails

- Verify MongoDB URI is correct
- Check MongoDB Atlas network access (whitelist 0.0.0.0/0)
- Ensure database user has read/write permissions

### Authentication Issues

- Verify `NEXTAUTH_URL` matches your deployment URL
- Check `NEXTAUTH_SECRET` is set and at least 32 characters
- For Google OAuth, verify redirect URI in Google Console

### API Routes Timeout

- Vercel free tier has 10-second timeout for serverless functions
- Optimize database queries
- Consider upgrading to Pro plan for 60-second timeout

## Performance Optimization

### Enable Edge Caching

Add to `next.config.js`:

```js
experimental: {
  serverActions: true,
}
```

### Database Indexes

Ensure indexes are created (already in models):
- User: `email`
- Stock: `symbol`, `sector`, `active`
- Order: `userId`, `symbol`, `status`
- Trade: `userId`, `symbol`
- Holding: `userId + symbol` (compound unique)

### Price Caching

The app caches stock prices for 2 minutes in MongoDB to reduce Yahoo Finance API calls.

## Monitoring

### Vercel Analytics

Enable in project settings for:
- Page views
- Performance metrics
- Error tracking

### MongoDB Atlas Monitoring

- Monitor connection count
- Check slow queries
- Set up alerts for high CPU/memory

## Scaling Considerations

### Free Tier Limits

- Vercel: 100 GB bandwidth/month
- MongoDB Atlas: 512 MB storage, shared CPU
- Sufficient for 1000-5000 users

### Upgrade Path

1. **Vercel Pro** ($20/month): More bandwidth, faster builds
2. **MongoDB M10** ($57/month): Dedicated cluster, better performance
3. **Redis Cache**: Add Redis for price caching (Upstash free tier)

## Security Checklist

- [ ] `NEXTAUTH_SECRET` is strong and unique
- [ ] MongoDB user has minimal required permissions
- [ ] Google OAuth redirect URIs are exact
- [ ] Environment variables are not in code
- [ ] HTTPS is enforced (automatic on Vercel)
- [ ] Rate limiting considered for API routes

## Post-Deployment

1. Test authentication flow
2. Place test orders
3. Verify price fetching works
4. Check leaderboard updates
5. Monitor error logs in Vercel dashboard

## Continuous Deployment

Vercel automatically deploys on:
- Push to `main` branch → Production
- Push to other branches → Preview deployments
- Pull requests → Preview deployments

## Support

- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com
- NextAuth Docs: https://next-auth.js.org

---

**Estimated Deployment Time**: 15-20 minutes

**Cost**: $0/month (using free tiers)
