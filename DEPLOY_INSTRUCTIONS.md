# Deploy Instructions for Vercel

## Manual Deployment Steps

Since we're having issues with pushing sensitive files to GitHub, you can deploy manually to Vercel:

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy your project**:
   ```bash
   vercel --prod
   ```

4. **Set up environment variables in Vercel dashboard**:
   - Go to your Vercel project dashboard
   - Go to Settings > Environment Variables
   - Add these variables:
     - `FIREBASE_SERVICE_ACCOUNT_KEY` (your Firebase service account JSON)
     - `IMGBB_API_KEY` (your ImgBB API key)

## What's Fixed

1. **Client-side routing**: Added `_redirects` file and updated Vercel configuration to properly handle client-side routing. This should fix the 404 errors on admin pages.

2. **Firebase configuration**: Updated Firebase configuration with placeholder API keys. You need to replace these with your actual Firebase configuration in `client/src/lib/firebase.ts`.

3. **API routes**: Created a separate API file (`api/index.ts`) specifically for Vercel's serverless functions.

## After Deployment

1. Replace the placeholder Firebase API key and App ID in `client/src/lib/firebase.ts` with your actual values.
2. Set up the environment variables in your Vercel dashboard.
3. Redeploy your application.

## Troubleshooting

If you still get 404 errors on admin pages:
1. Make sure the `_redirects` file is in the root of your deployment
2. Check that your Vercel configuration is properly set up to handle SPA routing
3. Verify that your routes in `client/src/App.tsx` match the URLs you're trying to access