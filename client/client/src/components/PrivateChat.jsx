import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Paperclip, Smile, User } from 'lucide-react';
import MessageList from './MessageList';
import FileUpload from './FileUpload';
import EmojiPicker from './EmojiPicker';
import { useSocket } from '../contexts/SocketContext';

const PrivateChat = ({ currentUser, otherUserId, onBack }) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const messageInputRef = useRef(null);
  
  const { 
    connected, 
    privateMessages, 
    onlineUsers,
    sendPrivateMessage, 
    getPrivateMessages,
    markMessageRead
  } = useSocket();

  const otherUser = onlineUsers.find(user => user.id === otherUserId);
  const conversation = privateMessages[otherUserId] || [];

  useEffect(() => {
    getPrivateMessages(otherUserId);
    markMessageRead(otherUserId);
  }, [otherUserId, getPrivateMessages, markMessageRead]);

  useEffect(() => {
    messageInputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!message.trim() || !connected) return;

    sendPrivateMessage(message.trim(), otherUserId);
    setMessage('');
  };

  const handleEmojiSelect = (emoji) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    messageInputRef.current?.focus();
  };

  const handleFileUpload = (file) => {
    if (file.type.startsWith('image/')) {
      sendPrivateMessage(`Shared an image: ${file.originalName}`, otherUserId, 'image', file);
    } else {
      sendPrivateMessage(`Shared a file: ${file.originalName}`, otherUserId, 'file', file);
    }
    setShowFileUpload(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-4 p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </button>
          
          <div className="flex items-center">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                {otherUser ? otherUser.username.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
              </div>
              {otherUser?.online && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full online-pulse"></div>
              )}
            </div>
            
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {otherUser?.username || 'Unknown User'}
              </h1>
              <p className="text-sm text-gray-500">
                {otherUser?.online ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        {conversation.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-4">💬</div>
              <p className="text-lg font-medium mb-2">Start a conversation</p>
              <p className="text-sm">Send a message to {otherUser?.username || 'this user'}</p>
            </div>
          </div>
        ) : (
          <MessageList
            messages={conversation}
            currentUser={currentUser}
            onReaction={() => {}} // Private messages don't have reactions in this implementation
          />
        )}
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <textarea
              ref={messageInputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder={`Message ${otherUser?.username || 'user'}`}
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

export default PrivateChat;