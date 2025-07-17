import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import LoginForm from './components/LoginForm';
import ChatApp from './components/ChatApp';
import { SocketProvider } from './contexts/SocketContext';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('chat_token');
    const savedUser = localStorage.getItem('chat_user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('chat_token', userToken);
    localStorage.setItem('chat_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('chat_token');
    localStorage.removeItem('chat_user');
  };

  if (!user || !token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <LoginForm onLogin={handleLogin} />
        <Toaster position="top-right" />
      </div>
    );
  }

  return (
    <SocketProvider token={token} user={user}>
      <div className="min-h-screen bg-gray-50">
        <ChatApp user={user} onLogout={handleLogout} />
        <Toaster position="top-right" />
      </div>
    </SocketProvider>
  );
}

export default App;