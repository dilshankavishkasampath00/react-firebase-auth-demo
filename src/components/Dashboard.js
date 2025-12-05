import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import '../styles/auth.css';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate('/');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (loading) {
    return <div className="auth-container"><p style={{textAlign: 'center'}}>Loading...</p></div>;
  }

  return (
    <div className="auth-container">
      <div style={{textAlign: 'center', marginBottom: '30px'}}>
        <h2>Welcome, {user?.displayName || user?.email}!</h2>
        {user?.photoURL && (
          <img 
            src={user.photoURL} 
            alt="Profile" 
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              marginBottom: '15px'
            }}
          />
        )}
      </div>

      <div style={{
        background: '#f5f5f5',
        padding: '20px',
        borderRadius: '6px',
        marginBottom: '20px'
      }}>
        <h3 style={{margin: '0 0 15px 0', color: '#333'}}>Account Information</h3>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>User ID:</strong> {user?.uid}</p>
        <p><strong>Email Verified:</strong> {user?.emailVerified ? '✓ Yes' : '✗ No'}</p>
        <p><strong>Provider:</strong> {user?.providerData[0]?.providerId || 'Email/Password'}</p>
      </div>

      <button onClick={handleLogout} className="btn-primary">
        Logout
      </button>

      <div className="link-text">
        <button onClick={() => navigate('/forgot-password')}>Change Password</button>
      </div>
    </div>
  );
}

export default Dashboard;
