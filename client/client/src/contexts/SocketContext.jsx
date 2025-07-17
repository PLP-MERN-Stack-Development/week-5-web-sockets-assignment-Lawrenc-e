import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children, token, user }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messages, setMessages] = useState({});
  const [privateMessages, setPrivateMessages] = useState({});
  const [typingUsers, setTypingUsers] = useState({});
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!token) return;

    const newSocket = io('http://localhost:3001', {
      auth: { token }
    });

    newSocket.on('connect', () => {
      setConnected(true);
      toast.success('Connected to chat server');
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
      toast.error('Disconnected from chat server');
    });

    newSocket.on('connect_error', (error) => {
      toast.error('Connection failed: ' + error.message);
    });

    newSocket.on('users_update', (users) => {
      setOnlineUsers(users);
    });

    newSocket.on('room_messages', (data) => {
      setMessages(prev => ({
        ...prev,
        [data.room]: data.messages
      }));
    });

    newSocket.on('new_message', (message) => {
      setMessages(prev => ({
        ...prev,
        [message.room]: [...(prev[message.room] || []), message]
      }));

      // Show notification if not from current user
      if (message.sender.id !== user.id) {
        const notification = {
          id: Date.now(),
          title: `New message from ${message.sender.username}`,
          body: message.content,
          timestamp: new Date()
        };
        
        setNotifications(prev => [...prev, notification]);
        
        // Browser notification
        if (Notification.permission === 'granted') {
          new Notification(notification.title, {
            body: notification.body,
            icon: '/vite.svg'
          });
        }
        
        // Sound notification
        const audio = new Audio('/notification.mp3');
        audio.play().catch(() => {}); // Ignore errors if sound file doesn't exist
      }
    });

    newSocket.on('new_private_message', (message) => {
      const otherUserId = message.sender.id === user.id ? message.recipient : message.sender.id;
      
      setPrivateMessages(prev => ({
        ...prev,
        [otherUserId]: [...(prev[otherUserId] || []), message]
      }));

      if (message.sender.id !== user.id) {
        toast.success(`New private message from ${message.sender.username}`);
      }
    });

    newSocket.on('private_messages', (data) => {
      setPrivateMessages(prev => ({
        ...prev,
        [data.userId]: data.messages
      }));
    });

    newSocket.on('user_typing', (data) => {
      setTypingUsers(prev => ({
        ...prev,
        [`${data.room}-${data.userId}`]: {
          username: data.username,
          room: data.room
        }
      }));
    });

    newSocket.on('user_stop_typing', (data) => {
      setTypingUsers(prev => {
        const newTyping = { ...prev };
        delete newTyping[`${data.room}-${data.userId}`];
        return newTyping;
      });
    });

    newSocket.on('user_joined', (data) => {
      toast.success(`${data.user.username} joined the chat`);
    });

    newSocket.on('user_left', (data) => {
      toast(`${data.user.username} left the chat`, { icon: '👋' });
    });

    newSocket.on('reaction_update', (data) => {
      setMessages(prev => {
        const newMessages = { ...prev };
        Object.keys(newMessages).forEach(room => {
          newMessages[room] = newMessages[room].map(msg =>
            msg.id === data.messageId
              ? { ...msg, reactions: data.reactions }
              : msg
          );
        });
        return newMessages;
      });
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [token, user.id]);

  // Request notification permission
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const sendMessage = (content, room, type = 'text', file = null) => {
    if (socket && connected) {
      socket.emit('send_message', { content, room, type, file });
    }
  };

  const sendPrivateMessage = (content, recipient, type = 'text', file = null) => {
    if (socket && connected) {
      socket.emit('send_private_message', { content, recipient, type, file });
    }
  };

  const joinRoom = (roomId) => {
    if (socket && connected) {
      socket.emit('join_room', roomId);
    }
  };

  const leaveRoom = (roomId) => {
    if (socket && connected) {
      socket.emit('leave_room', roomId);
    }
  };

  const startTyping = (room) => {
    if (socket && connected) {
      socket.emit('typing_start', { room });
    }
  };

  const stopTyping = (room) => {
    if (socket && connected) {
      socket.emit('typing_stop', { room });
    }
  };

  const addReaction = (messageId, reaction, room) => {
    if (socket && connected) {
      socket.emit('add_reaction', { messageId, reaction, room });
    }
  };

  const getPrivateMessages = (userId) => {
    if (socket && connected) {
      socket.emit('get_private_messages', { userId });
    }
  };

  const markMessageRead = (senderId) => {
    if (socket && connected) {
      socket.emit('mark_message_read', { senderId });
    }
  };

  const value = {
    socket,
    connected,
    onlineUsers,
    messages,
    privateMessages,
    typingUsers,
    notifications,
    sendMessage,
    sendPrivateMessage,
    joinRoom,
    leaveRoom,
    startTyping,
    stopTyping,
    addReaction,
    getPrivateMessages,
    markMessageRead
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};