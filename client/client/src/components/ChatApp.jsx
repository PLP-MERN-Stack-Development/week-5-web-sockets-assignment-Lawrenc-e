import React, { useState } from 'react';
import { MessageCircle, Users, Settings, LogOut, Hash, User } from 'lucide-react';
import ChatRoom from './ChatRoom';
import PrivateChat from './PrivateChat';
import UserList from './UserList';
import ConnectionStatus from './ConnectionStatus';
import NotificationPanel from './NotificationPanel';
import { useSocket } from '../contexts/SocketContext';

const ChatApp = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [activePrivateChat, setActivePrivateChat] = useState(null);
  const [showUserList, setShowUserList] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { connected, onlineUsers, notifications } = useSocket();

  const handlePrivateChat = (userId) => {
    setActivePrivateChat(userId);
    setActiveTab('private');
    setShowUserList(false);
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-6 h-6 text-blue-600" />
              <span className="font-semibold text-gray-900">Chat App</span>
            </div>
            <ConnectionStatus connected={connected} />
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Welcome, {user.username}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            <div className="space-y-1">
              <button
                onClick={() => {
                  setActiveTab('general');
                  setActivePrivateChat(null);
                }}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'general' && !activePrivateChat
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Hash className="w-4 h-4 mr-2" />
                General
              </button>
              
              <button
                onClick={() => setShowUserList(!showUserList)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Online Users
                </div>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  {onlineUsers.length}
                </span>
              </button>

              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  Notifications
                </div>
                {unreadNotifications > 0 && (
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                    {unreadNotifications}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* User List */}
          {showUserList && (
            <UserList
              users={onlineUsers}
              currentUser={user}
              onPrivateChat={handlePrivateChat}
            />
          )}

          {/* Notifications */}
          {showNotifications && (
            <NotificationPanel notifications={notifications} />
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onLogout}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-700 rounded-md hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {activePrivateChat ? (
          <PrivateChat
            currentUser={user}
            otherUserId={activePrivateChat}
            onBack={() => {
              setActivePrivateChat(null);
              setActiveTab('general');
            }}
          />
        ) : (
          <ChatRoom
            room={activeTab}
            currentUser={user}
          />
        )}
      </div>
    </div>
  );
};

export default ChatApp;