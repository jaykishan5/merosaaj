# merosaaj - Technical Setup Guide

This guide covers the environment setup and payment gateway configuration for the merosaaj platform.

## Environment Variables (.env.local)

Create a `.env.local` file in the root directory and add the following:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_string

# eSewa (Nepal)
ESEWA_MERCHANT_CODE=EPAYTEST
ESEWA_SECRET_KEY=8g8M89&pk9B9H698
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Khalti (Nepal)
KHALTI_SECRET_KEY=your_khalti_live_or_test_secret_key
NEXT_PUBLIC_KHALTI_PUBLIC_KEY=your_khalti_public_key

# Cloudinary (Optional - for images)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Payment Gateway Setup

### 1. eSewa Integration
- The current implementation supports **eSewa v2**.
- For production, replace `EPAYTEST` and the secret key with credentials from the eSewa Merchant Dashboard.
- Ensure your `success_url` and `failure_url` match the domains registered in eSewa.

### 2. Khalti Integration
- Obtain your keys from the [Khalti Merchant Dashboard](https://admin.khalti.com/).
- Use the **Test Secret Key** for development.
- The `khalti-checkout.js` script should be included in your checkout page.

## Deployment on Vercel
1. Push your code to GitHub.
2. Connect your repository to Vercel.
3. Add all environment variables in the Vercel Project Settings.
4. Ensure the `MONGODB_URI` allows connections from Vercel's IP range (0.0.0.0/0 in MongoDB Atlas).

## Admin Access
- To make a user an Admin:
  1. Register a user via the website.
  2. Open your MongoDB database (e.g., via MongoDB Compass).
  3. Change the `role` field of the user from `CUSTOMER` to `ADMIN`.
```javascript
// MongoDB Shell Example
db.users.updateOne({ email: "admin@merosaaj.com" }, { $set: { role: "ADMIN" } })
```
