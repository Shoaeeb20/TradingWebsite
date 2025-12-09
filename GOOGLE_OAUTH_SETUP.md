# Google OAuth Setup Guide

Follow these steps to enable Google Sign-In for your PaperTrade India application.

## Step 1: Go to Google Cloud Console

Visit: https://console.cloud.google.com/

## Step 2: Create a New Project (or Select Existing)

1. Click on the project dropdown at the top
2. Click "New Project"
3. Enter project name: `PaperTrade India` (or any name)
4. Click "Create"

## Step 3: Enable Google+ API

1. In the left sidebar, go to **APIs & Services** > **Library**
2. Search for "Google+ API"
3. Click on it and press "Enable"

## Step 4: Configure OAuth Consent Screen

1. Go to **APIs & Services** > **OAuth consent screen**
2. Select **External** (for public use) or **Internal** (for organization only)
3. Click "Create"
4. Fill in the required fields:
   - **App name**: `PaperTrade India`
   - **User support email**: Your email
   - **Developer contact email**: Your email
5. Click "Save and Continue"
6. Skip "Scopes" (click "Save and Continue")
7. Add test users if needed (for testing before publishing)
8. Click "Save and Continue"

## Step 5: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click "Create Credentials" > "OAuth client ID"
3. Select **Application type**: `Web application`
4. Enter **Name**: `PaperTrade India Web Client`
5. Add **Authorized JavaScript origins**:
   ```
   http://localhost:3000
   https://your-vercel-domain.vercel.app
   ```
6. Add **Authorized redirect URIs**:
   ```
   http://localhost:3000/api/auth/callback/google
   https://your-vercel-domain.vercel.app/api/auth/callback/google
   ```
7. Click "Create"

## Step 6: Copy Your Credentials

After creating, a popup will show:
- **Client ID**: Copy this (looks like: `123456789-abc123def456.apps.googleusercontent.com`)
- **Client Secret**: Copy this (looks like: `GOCSPX-abc123def456`)

## Step 7: Add to Environment Variables

### For Local Development (.env.local):
```env
GOOGLE_CLIENT_ID=123456789-abc123def456.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123def456
```

### For Vercel Deployment:
1. Go to your Vercel project dashboard
2. Navigate to **Settings** > **Environment Variables**
3. Add both variables:
   - Name: `GOOGLE_CLIENT_ID`, Value: `your-client-id`
   - Name: `GOOGLE_CLIENT_SECRET`, Value: `your-client-secret`
4. Click "Save"
5. Redeploy your application

## Important URLs Summary

| Environment | Authorized JavaScript Origin | Authorized Redirect URI |
|-------------|------------------------------|-------------------------|
| Local | `http://localhost:3000` | `http://localhost:3000/api/auth/callback/google` |
| Production | `https://your-app.vercel.app` | `https://your-app.vercel.app/api/auth/callback/google` |

## Testing

1. Restart your development server: `npm run dev`
2. Go to `http://localhost:3000/auth/signin`
3. Click "Sign in with Google"
4. You should see Google's OAuth consent screen
5. Sign in with your Google account

## Troubleshooting

### Error: "redirect_uri_mismatch"
- Make sure the redirect URI in Google Console exactly matches: `http://localhost:3000/api/auth/callback/google`
- Check for trailing slashes (should NOT have one)
- Verify the protocol (http vs https)

### Error: "Access blocked: This app's request is invalid"
- Complete the OAuth consent screen configuration
- Add your email as a test user if the app is not published

### Error: "idpiframe_initialization_failed"
- Clear browser cookies and cache
- Try in incognito/private mode
- Check if third-party cookies are enabled

## Making Your App Public (Optional)

To allow any Google user to sign in:
1. Go to **OAuth consent screen**
2. Click "Publish App"
3. Submit for verification (required for production apps)

For testing, you can add up to 100 test users without publishing.

## Security Notes

- Never commit `.env.local` or `.env` files to Git
- Keep your `GOOGLE_CLIENT_SECRET` private
- Rotate credentials if they are exposed
- Use different credentials for development and production

---

**Need Help?** Check the official documentation:
- NextAuth.js Google Provider: https://next-auth.js.org/providers/google
- Google OAuth 2.0: https://developers.google.com/identity/protocols/oauth2
