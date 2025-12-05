import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import '../styles/auth.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState('');
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent! Check your inbox.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Reset Password</h2>
      <p className="auth-subtitle">Enter your email to receive a reset link</p>
      
      {error && <div className={`alert alert-error show`}>{error}</div>}
      {message && <div className={`alert alert-success show`}>{message}</div>}
      
      <form onSubmit={handleReset}>
        <div className="form-group">
          <label>📧 Email Address</label>
          <input 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            placeholder="you@example.com" 
            required 
            disabled={!!message}
          />
        </div>

        <button type="submit" className={`btn-primary ${loading ? 'loading' : ''}`} disabled={loading || !!message}>
          {loading ? 'Sending...' : 'Send Reset Email'}
        </button>
      </form>

      <div className="link-text">
        Remember your password? <button onClick={() => navigate('/')}>Back to Login</button>
      </div>

      <div className="link-text">
        Don't have an account? <button onClick={() => navigate('/signup')}>Create one</button>
      </div>
    </div>
  );
}

export default ForgotPassword;
