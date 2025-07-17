import React, { useEffect, useRef } from 'react';
import Message from './Message';

const MessageList = ({ messages, currentUser, onReaction }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-4">💬</div>
          <p className="text-lg font-medium mb-2">No messages yet</p>
          <p className="text-sm">Be the first to start the conversation!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
      {messages.map((message, index) => {
        const prevMessage = messages[index - 1];
        const showAvatar = !prevMessage || 
          prevMessage.sender.id !== message.sender.id ||
          new Date(message.timestamp) - new Date(prevMessage.timestamp) > 300000; // 5 minutes

        return (
          <Message
            key={message.id}
            message={message}
            currentUser={currentUser}
            showAvatar={showAvatar}
            onReaction={onReaction}
          />
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;