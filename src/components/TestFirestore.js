import React, { useState } from 'react';
import { db } from '../firebase';
import { setDoc, doc, serverTimestamp, getDocs, collection } from 'firebase/firestore';

function TestFirestore() {
  const [status, setStatus] = useState('');
  const [users, setUsers] = useState([]);

  const addTestUser = async () => {
    try {
      setStatus('⏳ Adding test user...');
      
      const testUserData = {
        uid: 'test-user-' + Date.now(),
        email: 'testuser@example.com',
        displayName: 'Test User ' + new Date().getTime(),
        photoURL: '',
        status: 'online',
        createdAt: serverTimestamp(),
        lastSeen: serverTimestamp()
      };

      await setDoc(doc(db, 'users', testUserData.uid), testUserData, { merge: true });
      
      setStatus('✅ Test user added successfully! Check your Firestore console.');
      console.log('✅ User added:', testUserData);
    } catch (error) {
      setStatus('❌ Error: ' + error.message);
      console.error('❌ Error adding user:', error);
    }
  };

  const checkDatabase = async () => {
    try {
      setStatus('⏳ Checking database...');
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      
      const usersList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setUsers(usersList);
      setStatus(`✅ Found ${usersList.length} user(s) in database`);
      console.log('✅ Users in database:', usersList);
    } catch (error) {
      setStatus('❌ Error: ' + error.message);
      console.error('❌ Error checking database:', error);
    }
  };

  return (
    <div style={{ 
      maxWidth: '600px', 
      margin: '50px auto', 
      padding: '20px',
      border: '2px solid #0084ff',
      borderRadius: '10px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2>🔧 Firestore Test Page</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={addTestUser}
          style={{
            padding: '12px 20px',
            marginRight: '10px',
            background: '#0084ff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          ➕ Add Test User
        </button>
        
        <button 
          onClick={checkDatabase}
          style={{
            padding: '12px 20px',
            background: '#31a24c',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          🔍 Check Database
        </button>
      </div>

      {status && (
        <div style={{
          padding: '15px',
          marginBottom: '20px',
          background: status.includes('✅') ? '#d4edda' : status.includes('❌') ? '#f8d7da' : '#fff3cd',
          border: '1px solid ' + (status.includes('✅') ? '#c3e6cb' : status.includes('❌') ? '#f5c6cb' : '#ffeeba'),
          borderRadius: '6px',
          color: status.includes('✅') ? '#155724' : status.includes('❌') ? '#721c24' : '#856404'
        }}>
          {status}
        </div>
      )}

      {users.length > 0 && (
        <div style={{
          background: '#f8f9fa',
          padding: '15px',
          borderRadius: '6px',
          marginTop: '20px'
        }}>
          <h3>Users in Database ({users.length}):</h3>
          {users.map((user, index) => (
            <div key={index} style={{
              padding: '10px',
              marginBottom: '10px',
              background: 'white',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}>
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Name:</strong> {user.displayName}</p>
              <p><strong>Status:</strong> {user.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TestFirestore;
