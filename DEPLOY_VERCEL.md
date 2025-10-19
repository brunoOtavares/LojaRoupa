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

- **Name**: `VITE_FIREBASE_PROJECT_ID`
- **Value**: `michel-multimarcas`
- **Environments**: Production, Preview, Development

- **Name**: `VITE_FIREBASE_APP_ID`
- **Value**: `1:918302799335:web:0c3c9361afe367a9583942`
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

1. **Updated `vercel.json`**: Added a rewrites rule to redirect all requests to `index.html`
2. **Added `_redirects` file**: Placed in `client/public/_redirects` to ensure proper routing

These changes ensure that all routes are handled by your React application instead of trying to find actual files on the server.

After deploying these changes, refreshing any page should work correctly without 404 errors.