import React, { useState } from 'react';
import { MoreHorizontal, Download, Heart, ThumbsUp, Laugh, Angry } from 'lucide-react';

const Message = ({ message, currentUser, showAvatar, onReaction }) => {
  const [showReactions, setShowReactions] = useState(false);
  const isOwnMessage = message.sender.id === currentUser.id;

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const reactions = [
    { emoji: '👍', icon: ThumbsUp, name: 'like' },
    { emoji: '❤️', icon: Heart, name: 'love' },
    { emoji: '😂', icon: Laugh, name: 'laugh' },
    { emoji: '😠', icon: Angry, name: 'angry' }
  ];

  const handleReaction = (reactionName) => {
    onReaction(message.id, reactionName);
    setShowReactions(false);
  };

  const renderFileContent = () => {
    if (!message.file) return null;

    if (message.type === 'image') {
      return (
        <div className="mt-2">
          <img
            src={`http://localhost:3001${message.file.url}`}
            alt={message.file.originalName}
            className="max-w-xs rounded-lg shadow-sm"
          />
        </div>
      );
    }

    if (message.type === 'file') {
      return (
        <div className="mt-2 p-3 bg-gray-100 rounded-lg flex items-center space-x-2">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">
              {message.file.originalName}
            </p>
          </div>
          <a
            href={`http://localhost:3001${message.file.url}`}
            download={message.file.originalName}
            className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Download className="w-4 h-4" />
          </a>
        </div>
      );
    }

    return null;
  };

  const renderReactions = () => {
    if (!message.reactions || Object.keys(message.reactions).length === 0) {
      return null;
    }

    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {Object.entries(message.reactions).map(([reaction, users]) => {
          if (users.length === 0) return null;
          
          const reactionData = reactions.find(r => r.name === reaction);
          const hasReacted = users.includes(currentUser.id);
          
          return (
            <button
              key={reaction}
              onClick={() => handleReaction(reaction)}
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs transition-colors ${
                hasReacted
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span className="mr-1">{reactionData?.emoji || reaction}</span>
              <span>{users.length}</span>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} message-enter`}>
      <div className={`flex max-w-xs lg:max-w-md ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        {showAvatar && !isOwnMessage && (
          <div className="flex-shrink-0 mr-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {message.sender.username.charAt(0).toUpperCase()}
            </div>
          </div>
        )}

        {/* Message Content */}
        <div className="relative group">
          {/* Sender name and time */}
          {showAvatar && (
            <div className={`flex items-center mb-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
              <span className="text-xs font-medium text-gray-600">
                {isOwnMessage ? 'You' : message.sender.username}
              </span>
              <span className="text-xs text-gray-400 ml-2">
                {formatTime(message.timestamp)}
              </span>
            </div>
          )}

          {/* Message bubble */}
          <div
            className={`px-4 py-2 rounded-2xl ${
              isOwnMessage
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-200 text-gray-900'
            }`}
          >
            <p className="text-sm whitespace-pre-wrap break-words">
              {message.content}
            </p>
            {renderFileContent()}
          </div>

          {/* Reactions */}
          {renderReactions()}

          {/* Reaction button */}
          <div className={`absolute top-0 ${isOwnMessage ? 'left-0' : 'right-0'} opacity-0 group-hover:opacity-100 transition-opacity`}>
            <div className="relative">
              <button
                onClick={() => setShowReactions(!showReactions)}
                className="p-1 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 transition-colors"
              >
                <MoreHorizontal className="w-4 h-4 text-gray-500" />
              </button>

              {/* Reaction picker */}
              {showReactions && (
                <div className={`absolute top-full mt-1 ${isOwnMessage ? 'left-0' : 'right-0'} bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex space-x-1 z-10`}>
                  {reactions.map((reaction) => (
                    <button
                      key={reaction.name}
                      onClick={() => handleReaction(reaction.name)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title={reaction.name}
                    >
                      <span className="text-lg">{reaction.emoji}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;