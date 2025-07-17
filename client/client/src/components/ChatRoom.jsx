import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile, Hash } from 'lucide-react';
import MessageList from './MessageList';
import TypingIndicator from './TypingIndicator';
import FileUpload from './FileUpload';
import EmojiPicker from './EmojiPicker';
import { useSocket } from '../contexts/SocketContext';

const ChatRoom = ({ room, currentUser }) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messageInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  
  const { 
    connected, 
    messages, 
    typingUsers, 
    sendMessage, 
    startTyping, 
    stopTyping,
    addReaction 
  } = useSocket();

  const roomMessages = messages[room] || [];
  const roomTypingUsers = Object.values(typingUsers).filter(
    user => user.room === room && user.username !== currentUser.username
  );

  useEffect(() => {
    messageInputRef.current?.focus();
  }, [room]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!message.trim() || !connected) return;

    sendMessage(message.trim(), room);
    setMessage('');
    handleStopTyping();
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    
    if (!isTyping) {
      setIsTyping(true);
      startTyping(room);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      handleStopTyping();
    }, 1000);
  };

  const handleStopTyping = () => {
    if (isTyping) {
      setIsTyping(false);
      stopTyping(room);
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleEmojiSelect = (emoji) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    messageInputRef.current?.focus();
  };

  const handleFileUpload = (file) => {
    if (file.type.startsWith('image/')) {
      sendMessage(`Shared an image: ${file.originalName}`, room, 'image', file);
    } else {
      sendMessage(`Shared a file: ${file.originalName}`, room, 'file', file);
    }
    setShowFileUpload(false);
  };

  const handleReaction = (messageId, reaction) => {
    addReaction(messageId, reaction, room);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center">
          <Hash className="w-5 h-5 text-gray-500 mr-2" />
          <h1 className="text-lg font-semibold text-gray-900 capitalize">
            {room}
          </h1>
          <div className="ml-auto text-sm text-gray-500">
            {connected ? 'Connected' : 'Disconnected'}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <MessageList
          messages={roomMessages}
          currentUser={currentUser}
          onReaction={handleReaction}
        />
        
        {/* Typing Indicator */}
        {roomTypingUsers.length > 0 && (
          <TypingIndicator users={roomTypingUsers} />
        )}
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <textarea
              ref={messageInputRef}
              value={message}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder={`Message #${room}`}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none max-h-32 transition-colors"
              rows={1}
              disabled={!connected}
            />
            
            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="absolute bottom-full mb-2 right-0">
                <EmojiPicker onSelect={handleEmojiSelect} />
              </div>
            )}
            
            {/* File Upload */}
            {showFileUpload && (
              <div className="absolute bottom-full mb-2 right-0">
                <FileUpload onUpload={handleFileUpload} />
              </div>
            )}
          </div>

          <div className="flex space-x-1">
            <button
              type="button"
              onClick={() => setShowFileUpload(!showFileUpload)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={!connected}
            >
              <Paperclip className="w-5 h-5" />
            </button>
            
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={!connected}
            >
              <Smile className="w-5 h-5" />
            </button>
            
            <button
              type="submit"
              disabled={!message.trim() || !connected}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;