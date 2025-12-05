import React, { useState, useEffect, useRef } from 'react';
import { auth, db } from '../firebase';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot,
  getDocs,
  setDoc,
  doc,
  serverTimestamp,
  getDoc
} from 'firebase/firestore';
import '../styles/chat.css';

function Chat() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const messagesEndRef = useRef(null);
  const currentUser = auth.currentUser;

  // Fetch all users with real-time listener
  useEffect(() => {
    if (!currentUser) return;

    setLoadingUsers(true);
    const usersRef = collection(db, 'users');
    
    const unsubscribe = onSnapshot(
      usersRef,
      (snapshot) => {
        const usersList = snapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter(user => user.id !== currentUser.uid)
          .sort((a, b) => (a.displayName || '').localeCompare(b.displayName || ''));
        
        setUsers(usersList);
        setLoadingUsers(false);
      },
      (error) => {
        console.error('Error fetching users:', error);
        setLoadingUsers(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  // Manual refresh users
  const refreshUsers = async () => {
    setRefreshing(true);
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      const usersList = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(user => user.id !== currentUser.uid)
        .sort((a, b) => (a.displayName || '').localeCompare(b.displayName || ''));
        
        setUsers(usersList);
        setLoadingUsers(false);
    } catch (error) {
      console.error('Error refreshing users:', error);
    } finally {
      setRefreshing(false);
    }
  };  // Save user data on login
  useEffect(() => {
    if (!currentUser) return;

    const saveUserData = async () => {
      try {
        const userRef = doc(db, 'users', currentUser.uid);
        await setDoc(userRef, {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName || 'User',
          photoURL: currentUser.photoURL,
          lastSeen: serverTimestamp(),
          status: 'online'
        }, { merge: true });
      } catch (error) {
        console.error('Error saving user data:', error);
      }
    };

    saveUserData();
  }, [currentUser]);

  // Fetch messages for selected conversation
  useEffect(() => {
    if (!selectedUser || !currentUser) return;

    const conversationId = [currentUser.uid, selectedUser.id].sort().join('_');
    const messagesRef = collection(db, 'conversations', conversationId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(messagesList);
      scrollToBottom();
    });

    return unsubscribe;
  }, [selectedUser, currentUser]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedUser || !currentUser) return;

    setLoading(true);
    try {
      const conversationId = [currentUser.uid, selectedUser.id].sort().join('_');
      const messagesRef = collection(db, 'conversations', conversationId, 'messages');

      await addDoc(messagesRef, {
        senderId: currentUser.uid,
        senderName: currentUser.displayName || 'User',
        senderEmail: currentUser.email,
        senderPhotoURL: currentUser.photoURL,
        receiverId: selectedUser.id,
        text: messageText.trim(),
        timestamp: serverTimestamp(),
        read: false
      });

      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase().trim();
    if (!searchLower) return true;
    
    // Search by user ID, email, or display name
    return (
      user.id.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      (user.displayName && user.displayName.toLowerCase().includes(searchLower))
    );
  });

  // Search user by ID directly from Firebase
  const searchUserById = async (userId) => {
    const trimmedId = userId.trim();
    if (!trimmedId) {
      alert('⚠️ Please enter a user ID to search');
      return;
    }

    try {
      // First, try exact match
      const userRef = doc(db, 'users', trimmedId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = {
          id: userSnap.id,
          ...userSnap.data()
        };
        
        // Check if user is not current user
        if (userData.id !== currentUser.uid) {
          setSelectedUser(userData);
          setSearchQuery('');
          return;
        } else {
          alert('⚠️ Cannot chat with yourself');
          return;
        }
      }
      
      // If exact match not found, search in loaded users list
      const foundUser = users.find(u => 
        u.id === trimmedId || 
        u.id.includes(trimmedId) ||
        u.email === trimmedId
      );
      
      if (foundUser) {
        setSelectedUser(foundUser);
        setSearchQuery('');
      } else {
        alert('❌ User ID not found. Please check the ID and try again.');
      }
    } catch (error) {
      console.error('Error searching user:', error);
      alert('❌ Error searching user. Please try again.');
    }
  };

  // Handle Enter key to search by ID
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      const searchTerm = searchQuery.trim();
      // If search looks like a user ID (longer string or contains special chars), search directly
      if (searchTerm.length > 15) {
        searchUserById(searchTerm);
      }
    }
  };

  return (
    <div className="chat-container">
      {/* Users List Panel */}
      <div className="chat-sidebar">
        <div className="chat-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
            <h3 style={{ margin: 0 }}>💬 Members</h3>
            <button 
              onClick={refreshUsers}
              disabled={refreshing}
              style={{
                background: 'none',
                border: 'none',
                cursor: refreshing ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                opacity: refreshing ? 0.5 : 1,
                animation: refreshing ? 'spin 1s linear infinite' : 'none'
              }}
              title="Refresh users"
            >
              🔄
            </button>
          </div>
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name, email, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleSearchKeyPress}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
          {searchQuery.length > 0 && (
            <button
              type="button"
              onClick={() => searchUserById(searchQuery)}
              style={{
                position: 'absolute',
                right: '32px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: '#0084ff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '4px 8px',
                fontSize: '11px',
                cursor: 'pointer',
                fontWeight: 600
              }}
              title="Search by User ID"
            >
              Search
            </button>
          )}
        </div>

        <div className="users-list">
          {loadingUsers ? (
            <div className="no-users">
              <p style={{ fontSize: '18px', animation: 'spin 1s linear infinite' }}>⏳</p>
              <p>Loading members...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="no-users">
              <p className="no-users-icon">👥</p>
              <p>No members yet</p>
              <p style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>Be the first to join or wait for others</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="no-users">
              <p className="no-users-icon">🔎</p>
              <p>No matches found</p>
              <p style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>Try a different search term</p>
              <p style={{ fontSize: '11px', color: '#aaa', marginTop: '10px', fontStyle: 'italic' }}>
                💡 Type a user ID above and click Search to find members
              </p>
            </div>
          ) : (
            <>
              <div style={{ padding: '8px 12px', fontSize: '12px', color: '#999', fontWeight: 600 }}>
                👥 {filteredUsers.length} {filteredUsers.length === 1 ? 'member' : 'members'} found
              </div>
              {filteredUsers.map(user => (
                <div
                  key={user.id}
                  className={`user-item ${selectedUser?.id === user.id ? 'active' : ''}`}
                  onClick={() => setSelectedUser(user)}
                  title={`ID: ${user.id}`}
                >
                  <div className="user-avatar-wrapper">
                    <div className="user-avatar">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt={user.displayName} />
                      ) : (
                        <span>{user.displayName?.[0] || user.email?.[0] || 'U'}</span>
                      )}
                    </div>
                    <span className="status-indicator online"></span>
                  </div>
                  <div className="user-info">
                    <p className="user-name">{user.displayName || 'User'}</p>
                    <p className="user-email">{user.email}</p>
                    <p style={{ margin: '2px 0', fontSize: '11px', color: '#999', fontFamily: 'monospace' }}>
                      ID: {user.id.substring(0, 8)}...
                    </p>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Messages Panel */}
      <div className="chat-main">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="messages-header">
              <div className="chat-user-info">
                <div className="chat-user-avatar">
                  {selectedUser.photoURL ? (
                    <img src={selectedUser.photoURL} alt={selectedUser.displayName} />
                  ) : (
                    <span>{selectedUser.displayName?.[0] || selectedUser.email?.[0] || 'U'}</span>
                  )}
                  <span className="status-indicator online"></span>
                </div>
                <div>
                  <p className="chat-user-name">{selectedUser.displayName || 'User'}</p>
                  <p className="chat-user-email">{selectedUser.email}</p>
                </div>
              </div>
              <div className="chat-actions">
                <button className="action-icon" title="Call">📞</button>
                <button className="action-icon" title="Video">📹</button>
                <button className="action-icon" title="More">⋮</button>
              </div>
            </div>

            {/* Messages List */}
            <div className="messages-list">
              {messages.length === 0 ? (
                <div className="empty-chat">
                  <p className="empty-emoji">💬</p>
                  <p className="empty-text">No messages yet</p>
                  <p className="empty-subtext">Start a conversation with {selectedUser.displayName || 'this user'}</p>
                </div>
              ) : (
                messages.map(message => (
                  <div
                    key={message.id}
                    className={`message-group ${message.senderId === currentUser.uid ? 'sent' : 'received'}`}
                  >
                    {message.senderId !== currentUser.uid && (
                      <div className="message-avatar">
                        {selectedUser.photoURL ? (
                          <img src={selectedUser.photoURL} alt={selectedUser.displayName} />
                        ) : (
                          <span>{selectedUser.displayName?.[0] || selectedUser.email?.[0] || 'U'}</span>
                        )}
                      </div>
                    )}
                    <div className="message-bubble">
                      <div className="message-text">{message.text}</div>
                      <div className="message-time">
                        {message.timestamp?.toDate?.()?.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        }) || 'Just now'}
                      </div>
                    </div>
                    {message.senderId === currentUser.uid && (
                      <div className="message-avatar">
                        {currentUser.photoURL ? (
                          <img src={currentUser.photoURL} alt="You" />
                        ) : (
                          <span>{currentUser.displayName?.[0] || currentUser.email?.[0] || 'U'}</span>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Box - Social Media Style */}
            <form onSubmit={sendMessage} className="message-input-box">
              <div className="input-wrapper">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Aa"
                  className="message-input"
                  disabled={loading}
                />
                <div className="input-actions">
                  <button type="button" className="action-btn" title="Emoji">😊</button>
                  <button type="button" className="action-btn" title="Add file">📎</button>
                  <button type="button" className="action-btn" title="Add image">🖼️</button>
                </div>
              </div>
              <button
                type="submit"
                className={`send-btn ${loading ? 'loading' : ''}`}
                disabled={loading || !messageText.trim()}
                title="Send message"
              >
                {loading ? '⏳' : '➤'}
              </button>
            </form>
          </>
        ) : (
          <div className="no-chat-selected">
            <div className="empty-state">
              <p className="emoji">💬</p>
              <p className="title">Select a conversation to start</p>
              <p className="subtitle">Choose a contact from the list or search for someone</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
