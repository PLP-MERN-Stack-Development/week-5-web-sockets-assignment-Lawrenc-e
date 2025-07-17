import React from 'react';
import { Bell, X } from 'lucide-react';

const NotificationPanel = ({ notifications }) => {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="border-t border-gray-200">
      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
          <Bell className="w-4 h-4 mr-2" />
          Notifications ({notifications.length})
        </h3>
        
        <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
          {notifications.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            notifications.slice().reverse().map((notification) => (
              <div
                key={notification.id}
                className="p-2 bg-blue-50 border border-blue-200 rounded-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900">
                      {notification.title}
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      {notification.body}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      {formatTime(notification.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;