import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import Chat from './Chat';
import '../styles/dashboard.css';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
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
    return <div className="dashboard-loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="dashboard-container">
      {/* Top Navigation Bar */}
      <div className="dashboard-navbar">
        <div className="navbar-brand">
          <h1>🚀 Auth Demo</h1>
        </div>
        <div className="navbar-spacer"></div>
        <button className="profile-button" onClick={() => setShowProfile(!showProfile)}>
          {user?.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="profile-avatar-small" />
          ) : (
            <div className="profile-avatar-small default-avatar">
              {(user?.displayName || user?.email).charAt(0).toUpperCase()}
            </div>
          )}
          <span>{user?.displayName || 'User'}</span>
          <span className="dropdown-arrow">▼</span>
        </button>
      </div>

      {/* Profile Dropdown */}
      {showProfile && (
        <div className="profile-dropdown">
          <button onClick={() => setShowProfile(false)}>✕ Close</button>
          <hr />
          <p><strong>Name:</strong> {user?.displayName || 'Not set'}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>User ID:</strong> {user?.uid}</p>
          <p><strong>Verified:</strong> {user?.emailVerified ? '✓ Yes' : '✗ No'}</p>
          <p><strong>Provider:</strong> {user?.providerData[0]?.providerId || 'Email/Password'}</p>
          <hr />
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      )}

      {/* Left Sidebar */}
      <div className="dashboard-sidebar">
        <div className="sidebar-menu">
          <div 
            className={`menu-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <span>📊</span> Dashboard
          </div>
          <div 
            className={`menu-item ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            <span>💬</span> Chat
          </div>
          <div className="menu-item" onClick={() => navigate('/forgot-password')}>
            <span>🔐</span> Change Password
          </div>
          <div className="menu-item">
            <span>⚙️</span> Settings
          </div>
          <div className="menu-item">
            <span>❓</span> Help
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        {activeTab === 'chat' ? (
          <Chat />
        ) : (
          <>
            {/* Hero Section with Animation */}
            <div className="dashboard-hero">
          <div className="hero-content">
            <h2 className="hero-title">Welcome, {user?.displayName || 'User'}! 👋</h2>
            <p className="hero-subtitle">You are now logged in to your secure account</p>
            
            {/* Profile Card with Animation */}
            <div className="profile-card-large">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="profile-avatar-large" />
              ) : (
                <div className="profile-avatar-large default-avatar-large">
                  {(user?.displayName || user?.email).charAt(0).toUpperCase()}
                </div>
              )}
              <div className="profile-info">
                <h3>{user?.displayName || 'User Profile'}</h3>
                <p>{user?.email}</p>
                <span className="auth-badge">
                  {user?.providerData[0]?.providerId === 'google.com' ? '🌐 Google Auth' 
                  : user?.providerData[0]?.providerId === 'github.com' ? '🐱 GitHub Auth'
                  : '📧 Email Auth'}
                </span>
              </div>
            </div>
          </div>

          {/* Animated Background Elements */}
          <div className="animated-bg">
            <div className="blob blob-1"></div>
            <div className="blob blob-2"></div>
            <div className="blob blob-3"></div>
          </div>
        </div>

        {/* Account Details Section */}
        <div className="dashboard-section">
          <h3 className="section-title">Account Details</h3>
          <div className="details-grid">
            <div className="detail-card">
              <div className="detail-icon">📧</div>
              <div className="detail-content">
                <label>Email Address</label>
                <p>{user?.email}</p>
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-icon">🔐</div>
              <div className="detail-content">
                <label>User ID</label>
                <p style={{fontSize: '12px', wordBreak: 'break-all'}}>{user?.uid}</p>
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-icon">✓</div>
              <div className="detail-content">
                <label>Email Verified</label>
                <p>{user?.emailVerified ? '✓ Verified' : '✗ Not Verified'}</p>
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-icon">🔗</div>
              <div className="detail-content">
                <label>Authentication Method</label>
                <p>{user?.providerData[0]?.providerId || 'Email/Password'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="dashboard-section">
          <h3 className="section-title">Quick Actions</h3>
          <div className="action-buttons">
            <button className="action-btn change-password" onClick={() => navigate('/forgot-password')}>
              <span>🔐</span> Change Password
            </button>
            <button className="action-btn edit-profile">
              <span>✏️</span> Edit Profile
            </button>
            <button className="action-btn logout" onClick={handleLogout}>
              <span>🚪</span> Logout
            </button>
          </div>
        </div>
          </>
        )}
      </div>

      {/* Right Info Panel */}
      <div className="dashboard-right">
        <div className="info-panel">
          <h4>📱 Session Info</h4>
          <div className="info-item">
            <label>Last Login</label>
            <p>Just now</p>
          </div>
          <div className="info-item">
            <label>Device</label>
            <p>Web Browser</p>
          </div>
          <div className="info-item">
            <label>Status</label>
            <p><span className="status-badge online">Online</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
