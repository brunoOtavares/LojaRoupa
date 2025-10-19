# Firebase Admin SDK Setup

The API is experiencing a 500 error when trying to fetch products because the Firebase Admin SDK is not properly initialized with authentication credentials.

## Error Message
```
GET /api/products 500 in 8930ms :: {"error":"Failed to fetch products"}
```

## Root Cause
The Firebase Admin SDK requires service account credentials to access Firestore from the server-side API. Without these credentials, the API cannot authenticate with Firebase and access the database.

## Solutions

### Option 1: Add Service Account Key to Environment Variables (Recommended for Production)

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`layout-loja`)
3. Go to Project Settings → Service Accounts
4. Click "Generate new private key"
5. Download the JSON file
6. Open the JSON file and copy its contents
7. Add the following to your `.env` file:

```
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"layout-loja",...}
```

**Note:** Make sure to properly escape the JSON string with newlines when adding to the .env file.

### Option 2: Create Service Account Key File (Recommended for Development)

1. Follow steps 1-4 from Option 1 to download the service account JSON file
2. Rename the downloaded file to `serviceAccountKey.json`
3. Place it in the `api/` directory of your project
4. The API will automatically detect and use this file

### Option 3: Use the Example File (Temporary Fix)

1. Copy `api/serviceAccountKey.example.json` to `api/serviceAccountKey.json`
2. Replace the placeholder values with your actual service account credentials

## Verifying the Fix

After implementing one of the solutions above:

1. Restart your development server
2. Check the server logs for messages like:
   - "Firebase Admin initialized with service account from env"
   - "Firebase Admin initialized with local service account file"
3. Test the API endpoint: `GET /api/products`

## Security Notes

- Never commit the actual `serviceAccountKey.json` file to version control
- The `.gitignore` file should already include `serviceAccountKey.json`
- For production deployments, use environment variables rather than files
- Regularly rotate your service account keys for security

## Troubleshooting

If you still encounter issues:

1. Check that the service account has the "Firestore Data Viewer" or "Firestore Data Admin" role
2. Verify the project ID in the service account key matches your Firebase project
3. Ensure the JSON is properly formatted without syntax errors
4. Check server logs for more detailed error messages