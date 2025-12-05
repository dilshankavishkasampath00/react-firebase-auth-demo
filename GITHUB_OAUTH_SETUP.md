# GitHub OAuth Setup Guide

## Step 1: Register GitHub OAuth App

1. Go to **GitHub Settings** → **Developer settings** → **OAuth Apps**
   - Direct link: https://github.com/settings/developers

2. Click **"New OAuth App"**

3. Fill in the form:
   - **Application name:** React Firebase Auth Demo
   - **Homepage URL:** 
     - For local: `http://localhost:3000`
     - For production: `https://react-firebase-auth-demo.vercel.app`
   - **Application description:** Firebase authentication app with GitHub login
   - **Authorization callback URL:**
     - For local: `http://localhost:3000`
     - For production: `https://react-firebase-auth-demo.vercel.app`

4. Click **"Register application"**

5. You'll get:
   - **Client ID** - Copy this
   - **Client Secret** - Click to reveal and copy this

---

## Step 2: Add GitHub Provider to Firebase

1. Go to **Firebase Console** → **Authentication** → **Sign-in method**

2. Click on **GitHub** provider

3. Enable it and paste:
   - **Client ID** from GitHub OAuth app
   - **Client Secret** from GitHub OAuth app

4. Copy the **Authorization callback URL** that Firebase provides

5. Go back to GitHub OAuth app settings and update:
   - **Authorization callback URL** with the Firebase callback URL

6. Click **"Save"** in Firebase

---

## Step 3: Add Domain to Firebase Authorized Domains

1. Go to **Firebase Console** → **Authentication** → **Settings**

2. Scroll to **Authorized domains**

3. Add your domain:
   - For local: `localhost:3000`
   - For production: `react-firebase-auth-demo.vercel.app`

---

## Step 4: Test GitHub Login

1. Refresh your app
2. Click **GitHub** button on Login or Signup page
3. You should be redirected to GitHub to authorize
4. After authorization, you'll be logged in!

---

## Troubleshooting

### "Invalid client_id"
- Make sure you added the Client ID to Firebase
- Check that the callback URL matches exactly

### "Authorization callback mismatch"
- GitHub callback URL must match exactly what Firebase provides
- Update GitHub OAuth app settings with Firebase callback URL

### GitHub button not working
- Clear browser cache
- Make sure GitHub provider is enabled in Firebase
- Check browser console for errors

---

## Security Notes

- Never share your Client Secret
- Keep it only in Firebase Console
- The secret is never sent to the browser
