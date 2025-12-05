import React, { useState, useEffect, useRef } from 'react';
import { auth, db } from '../firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  getDocs,
  setDoc,
  doc,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import '../styles/chat.css';

function Chat() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);
  const currentUser = auth.currentUser;

  // Fetch all users
  useEffect(() => {
    if (!currentUser) return;

    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, 'users');
        const snapshot = await getDocs(usersRef);
        const usersList = snapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter(user => user.id !== currentUser.uid);
        setUsers(usersList);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [currentUser]);

  // Save user data on login
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

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.displayName && user.displayName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="chat-container">
      {/* Users List Panel */}
      <div className="chat-sidebar">
        <div className="chat-header">
          <h3>💬 Messages</h3>
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="users-list">
          {filteredUsers.length === 0 ? (
            <div className="no-users">
              <p>No users found</p>
            </div>
          ) : (
            filteredUsers.map(user => (
              <div
                key={user.id}
                className={`user-item ${selectedUser?.id === user.id ? 'active' : ''}`}
                onClick={() => setSelectedUser(user)}
              >
                <div className="user-avatar">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName} />
                  ) : (
                    <span>{user.displayName?.[0] || user.email?.[0] || 'U'}</span>
                  )}
                  <span className="status-indicator online"></span>
                </div>
                <div className="user-info">
                  <p className="user-name">{user.displayName || 'User'}</p>
                  <p className="user-email">{user.email}</p>
                </div>
              </div>
            ))
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
            </div>

            {/* Messages List */}
            <div className="messages-list">
              {messages.length === 0 ? (
                <div className="empty-chat">
                  <p>👋 No messages yet. Start a conversation!</p>
                </div>
              ) : (
                messages.map(message => (
                  <div
                    key={message.id}
                    className={`message ${message.senderId === currentUser.uid ? 'sent' : 'received'}`}
                  >
                    <div className="message-avatar">
                      {message.senderId === currentUser.uid ? (
                        currentUser.photoURL ? (
                          <img src={currentUser.photoURL} alt="You" title="You" />
                        ) : (
                          <span title="You">{currentUser.displayName?.[0] || currentUser.email?.[0] || 'U'}</span>
                        )
                      ) : (
                        selectedUser.photoURL ? (
                          <img src={selectedUser.photoURL} alt={selectedUser.displayName} />
                        ) : (
                          <span>{selectedUser.displayName?.[0] || selectedUser.email?.[0] || 'U'}</span>
                        )
                      )}
                    </div>
                    <div className="message-content">
                      <p className="message-text">{message.text}</p>
                      <p className="message-time">
                        {message.timestamp?.toDate?.()?.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        }) || 'Just now'}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={sendMessage} className="message-input-form">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type a message..."
                className="message-input"
                disabled={loading}
              />
              <button
                type="submit"
                className={`send-button ${loading ? 'loading' : ''}`}
                disabled={loading || !messageText.trim()}
              >
                {loading ? '📤' : '📨'}
              </button>
            </form>
          </>
        ) : (
          <div className="no-chat-selected">
            <div className="empty-state">
              <p className="emoji">💬</p>
              <p className="title">Select a chat to start messaging</p>
              <p className="subtitle">Choose a user from the list to begin a conversation</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
