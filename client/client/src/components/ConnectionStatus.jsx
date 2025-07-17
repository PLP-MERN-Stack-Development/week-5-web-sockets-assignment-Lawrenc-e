import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';

const ConnectionStatus = ({ connected }) => {
  return (
    <div className={`flex items-center space-x-1 text-xs ${
      connected ? 'text-green-600' : 'text-red-600'
    }`}>
      {connected ? (
        <>
          <Wifi className="w-4 h-4" />
          <span>Connected</span>
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4" />
          <span>Disconnected</span>
        </>
      )}
    </div>
  );
};

export default ConnectionStatus;