# Vercel Deployment Instructions

## Environment Variables Configuration

To fix the Firebase authentication error when deploying to Vercel, you need to configure the following environment variables in your Vercel project:

### Required Environment Variables

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

#### Firebase Configuration
- **Name**: `VITE_FIREBASE_API_KEY`
- **Value**: `AIzaSyBnEdEiyfvlHUnYsU3PcSWjuwgvznlobPU`
- **Environments**: Production, Preview, Development

- **Name**: `VITE_FIREBASE_AUTH_DOMAIN`
- **Value**: `michel-multimarcas.firebaseapp.com`
- **Environments**: Production, Preview, Development

- **Name**: `VITE_FIREBASE_PROJECT_ID`
- **Value**: `michel-multimarcas`
- **Environments**: Production, Preview, Development

- **Name**: `VITE_FIREBASE_STORAGE_BUCKET`
- **Value**: `michel-multimarcas.firebasestorage.app`
- **Environments**: Production, Preview, Development

- **Name**: `VITE_FIREBASE_MESSAGING_SENDER_ID`
- **Value**: `918302799335`
- **Environments**: Production, Preview, Development

- **Name**: `VITE_FIREBASE_APP_ID`
- **Value**: `1:918302799335:web:0c3c9361afe367a9583942`
- **Environments**: Production, Preview, Development

- **Name**: `VITE_FIREBASE_MEASUREMENT_ID`
- **Value**: `G-59SCHV89DT`
- **Environments**: Production, Preview, Development

#### Server Configuration
- **Name**: `PORT`
- **Value**: `3001`
- **Environments**: Production, Preview, Development

- **Name**: `PRIVATE_OBJECT_DIR`
- **Value**: `stylevault-storage`
- **Environments**: Production, Preview, Development

#### Image Storage
- **Name**: `IMGBB_API_KEY`
- **Value**: `b2d4b255d1cc12e48b85f314e9ece95a`
- **Environments**: Production, Preview, Development

#### Firebase Service Account (for server-side operations)
- **Name**: `FIREBASE_SERVICE_ACCOUNT_KEY`
- **Value**: The complete JSON service account key
- **Environments**: Production, Preview, Development

### Important Notes

1. **VITE_ Prefix**: Variables with the `VITE_` prefix are exposed to the client-side code and are embedded during the build process. These must be set in Vercel before deploying.

2. **Redeployment Required**: After adding environment variables, you need to trigger a new deployment for the changes to take effect.

3. **Security**: Never commit your actual environment variables to your repository. Use the `.env.production.example` file as a template for documentation only.

### Troubleshooting

If you still encounter the "Firebase: Error (auth/invalid-api-key)" error:

1. Verify all environment variables are correctly set in Vercel
2. Check for any typos in the variable names or values
3. Ensure the variables are set for all environments (Production, Preview, Development)
4. Trigger a new deployment after adding/updating variables
5. Check the Vercel deployment logs for any additional error messages

### Deployment Steps

1. Push your code to your repository
2. Ensure all environment variables are configured in Vercel
3. Trigger a new deployment (either by pushing new code or manually through the Vercel dashboard)
4. Test the deployed application to ensure Firebase authentication works correctly

For more information, refer to the [Vercel Environment Variables documentation](https://vercel.com/docs/concepts/projects/environment-variables).

## Fixing 404 Errors on Page Refresh

If you're experiencing 404 errors when refreshing pages like `/admin`, `/destaques`, or other routes, this is because Vercel needs to be configured to handle client-side routing.

The following changes have been made to fix this issue:

1. **Updated `vercel.json`**: Added routes configuration to handle SPA routing
2. **Added `_redirects` file**: Placed in `client/public/_redirects` to ensure proper routing

### Additional Steps if 404 Errors Persist:

If you're still getting 404 errors after deployment, try these additional solutions:

#### Option 1: Use Vercel's Header Configuration
Create a `vercel.json` file with the following configuration (already implemented):
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist/public"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index.ts"
    },
    {
      "src": "/static/(.*)",
      "dest": "/static/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

#### Option 2: Configure in Vercel Dashboard
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Functions**
3. In the **Rewrites** section, add:
   - Source: `/(.*)`
   - Destination: `/index.html`

#### Option 3: Use Vercel's Next.js Configuration
If the above doesn't work, you might need to add a `next.config.js` file (even though you're not using Next.js):
```javascript
module.exports = {
  rewrites: () => [
    { source: '/(.*)', destination: '/index.html' }
  ]
}
```

After deploying these changes, refreshing any page should work correctly without 404 errors.

## Fixing MIME Type Errors for JavaScript Modules

If you're encountering errors like:
```
Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html"
```

This happens when the server tries to serve JavaScript files as HTML. The updated `vercel.json` configuration now includes specific routes for static assets to ensure they're served with the correct MIME types.

### What was fixed:
1. **Added specific routes for assets**: `/assets/(.*)` now correctly serves files from the assets directory
2. **Added file extension matching**: JavaScript, CSS, and other static files are served directly without being redirected to index.html
3. **Maintained SPA routing**: All other routes still redirect to index.html for client-side routing

If you still encounter MIME type errors after deployment:
1. Clear your browser cache completely
2. Try the site in an incognito/private window
3. Check the Vercel deployment logs for any additional errors