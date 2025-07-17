import React from 'react';

const TypingIndicator = ({ users }) => {
  if (users.length === 0) return null;

  const getUserText = () => {
    if (users.length === 1) {
      return `${users[0].username} is typing`;
    } else if (users.length === 2) {
      return `${users[0].username} and ${users[1].username} are typing`;
    } else {
      return `${users[0].username} and ${users.length - 1} others are typing`;
    }
  };

  return (
    <div className="px-4 py-2 text-sm text-gray-500">
      <div className="flex items-center space-x-2">
        <div className="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <span>{getUserText()}...</span>
      </div>
    </div>
  );
};

export default TypingIndicator;