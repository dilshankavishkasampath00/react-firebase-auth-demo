# GitHub OAuth Configuration - Quick Setup

## Problem
GitHub login button shows but redirects to GitHub 404 page. This means GitHub OAuth app is not configured yet.

## Solution: Register GitHub OAuth App

### Step 1: Go to GitHub OAuth App Settings
1. Open: https://github.com/settings/developers
2. Click on **"OAuth Apps"** in left menu (or go directly to OAuth Apps)

### Step 2: Create New OAuth App
1. Click **"New OAuth App"** button
2. Fill in the form:

```
Application name:
  React Firebase Auth Demo

Homepage URL:
  https://react-firebase-auth-demo.vercel.app

Application description:
  Firebase authentication app with GitHub and Google login

Authorization callback URL:
  https://myapplication-9dc616cb.firebaseapp.com/__/auth/handler
```

3. Click **"Register application"**

### Step 3: Get Your Credentials
After creating the app, you'll see:
- **Client ID** - Copy this
- **Client Secret** - Click "Generate" and copy it

Example:
- Client ID: `2412684`
- Client Secret: `lv23l31LGYOQSHzqV5`

### Step 4: Add to Firebase Console
1. Go to: https://console.firebase.google.com
2. Select project: `myapplication-9dc616cb`
3. Go to: **Authentication** → **Sign-in method**
4. Click on **GitHub** 
5. Click **"Enable"**
6. Paste:
   - **Client ID** from GitHub
   - **Client Secret** from GitHub
7. Copy the **Authorization callback URL** that Firebase provides
8. Click **"Save"**

### Step 5: Update GitHub App Settings
1. Go back to your GitHub OAuth app (https://github.com/settings/developers)
2. Update the **Authorization callback URL** with Firebase's callback URL
3. Click **"Update application"**

### Step 6: Add Domain to Firebase
1. Firebase Console → **Authentication** → **Settings**
2. Scroll to **Authorized domains**
3. Add: `react-firebase-auth-demo.vercel.app`
4. Click **"Add"**

### Step 7: Test
1. Refresh your app
2. Click GitHub button
3. You should be redirected to GitHub to authorize
4. After authorizing, you'll be logged in!

---

## Need Help?

### GitHub shows "404 - Page not found"
- OAuth app not registered or credentials not added to Firebase
- Follow steps above

### "This application is not allowed to request authorization"
- The callback URL doesn't match between GitHub and Firebase
- Make sure they're identical

### Firebase shows error
- Client ID and Secret might be wrong
- Go back to GitHub settings and copy them again
- Make sure there are no extra spaces

---

## Important URLs to Remember

- **GitHub OAuth Apps:** https://github.com/settings/developers
- **Firebase Console:** https://console.firebase.google.com
- **Your Live App:** https://react-firebase-auth-demo.vercel.app

