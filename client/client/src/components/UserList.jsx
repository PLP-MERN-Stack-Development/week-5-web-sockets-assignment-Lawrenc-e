import React from 'react';
import { MessageCircle, User } from 'lucide-react';

const UserList = ({ users, currentUser, onPrivateChat }) => {
  const otherUsers = users.filter(user => user.id !== currentUser.id);

  return (
    <div className="border-t border-gray-200">
      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Online Users ({otherUsers.length})
        </h3>
        
        <div className="space-y-2">
          {otherUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full online-pulse"></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {user.username}
                  </p>
                  <p className="text-xs text-green-600">Online</p>
                </div>
              </div>
              
              <button
                onClick={() => onPrivateChat(user.id)}
                className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title={`Message ${user.username}`}
              >
                <MessageCircle className="w-4 h-4" />
              </button>
            </div>
          ))}
          
          {otherUsers.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No other users online</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserList;