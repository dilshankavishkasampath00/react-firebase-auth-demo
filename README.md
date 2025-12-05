# React Firebase Authentication App

A modern, responsive authentication application built with React and Firebase. Features include email/password login, Google OAuth authentication, user signup, and password reset functionality.

## Features

✨ **Authentication Methods**
- Email/Password Login & Signup
- Google OAuth Login & Signup
- Forgot Password with email reset
- User Dashboard with account information

🎨 **User Interface**
- Modern gradient design with smooth animations
- Responsive layout (mobile-friendly)
- Form validation with helpful error messages
- Loading states and user feedback
- Professional color scheme

🔐 **Security**
- Firebase Authentication for secure user management
- Protected routes (Dashboard requires login)
- Password validation (minimum 6 characters)
- Email verification support

## Tech Stack

- **Frontend:** React 18, React Router v7
- **Backend:** Firebase Authentication
- **Styling:** Custom CSS with animations
- **Build Tool:** Create React App (react-scripts)

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase project with authentication enabled
- Google OAuth credentials configured in Firebase

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/dilshankavishkasampath00/react-firebase-auth-demo.git
   cd react-firebase-auth-demo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Open `src/firebase.js`
   - Replace the placeholder config with your Firebase project credentials
   - Get your config from Firebase Console → Project Settings

4. **Set up Google OAuth**
   - Go to Firebase Console → Authentication → Sign-in method
   - Enable Google sign-in provider
   - Configure OAuth consent screen
   - Add your domain to authorized domains

## Running Locally

```bash
npm start
```

The app will open at `http://localhost:3000`

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## Project Structure

```
src/
├── components/
│   ├── Login.js           # Login page with email/password and Google login
│   ├── Signup.js          # Signup page with form validation
│   ├── ForgotPassword.js  # Password reset page
│   └── Dashboard.js       # User dashboard (protected route)
├── styles/
│   └── auth.css           # Authentication page styling
├── App.js                 # Main app with routing
├── firebase.js            # Firebase configuration
├── index.js               # React entry point
└── index.css              # Global styles
```

## Authentication Flow

### Login
1. User enters email and password
2. Submits form → Firebase verifies credentials
3. On success → Redirected to Dashboard
4. Can also sign in with Google

### Signup
1. User enters name, email, password
2. Form validates inputs (6+ character password, matching passwords)
3. Submits → Firebase creates new account
4. User profile updated with display name
5. Redirected to Dashboard
6. Can also sign up with Google

### Forgot Password
1. User enters email
2. Firebase sends password reset email
3. User clicks link in email to reset password

### Dashboard
1. Protected route (requires authentication)
2. Displays user information and profile picture
3. Shows account details (email, user ID, provider, verification status)
4. Logout functionality

## Deployment Options

### Option 1: Firebase Hosting (Recommended)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

### Option 2: Vercel (Easiest)
1. Push to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Connect GitHub repository
4. Deploy with one click

### Option 3: Netlify
1. Push to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Connect GitHub repository
4. Set build command: `npm run build`
5. Set publish directory: `build`

## Environment Variables

Create a `.env.local` file for sensitive data:

```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
```

## Troubleshooting

### Google Login Not Working
- Check that domain is added to authorized domains in Firebase Console
- Ensure Google OAuth provider is enabled in Firebase
- Check browser console for specific error messages

### "auth/unauthorized-domain" Error
- Go to Firebase Console → Authentication → Settings
- Add your deployment domain to authorized domains
- For localhost: add `localhost:3000`

### Build Errors
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear npm cache: `npm cache clean --force`

## License

MIT License - feel free to use this project for personal or commercial use.

## Support

For issues or questions, please open an issue on GitHub.

---

**Made with ❤️ by Dilshan Kavishka Sampath**
