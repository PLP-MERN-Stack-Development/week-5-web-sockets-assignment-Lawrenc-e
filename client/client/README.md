# Real-Time Chat Application

A comprehensive real-time chat application built with Socket.io, React, and Express.js featuring modern UI, private messaging, file sharing, and advanced chat features.

## 🚀 Features

### Core Functionality

- **Real-time messaging** with Socket.io
- **User authentication** (username-based)
- **Global chat room** for all users
- **Private messaging** between users
- **Online/offline status** indicators
- **Typing indicators** when users are composing messages

### Advanced Features

- **Message reactions** (like, love, laugh, angry)
- **File and image sharing** with upload support
- **Message timestamps** and sender information
- **Unread message notifications**
- **Browser notifications** with Web Notifications API
- **Sound notifications** for new messages
- **Responsive design** for desktop and mobile

### Technical Features

- **Automatic reconnection** handling
- **Message delivery acknowledgment**
- **Performance optimized** Socket.io implementation
- **Clean, modern UI** with Tailwind CSS
- **Real-time user list** with online status
- **Notification panel** with message history

## 🛠️ Tech Stack

### Backend

- **Node.js** with Express.js
- **Socket.io** for real-time communication
- **JWT** for authentication
- **Multer** for file uploads
- **CORS** for cross-origin requests

### Frontend

- **React** with hooks
- **Socket.io Client** for real-time features
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Hot Toast** for notifications
- **Vite** for development and building

## 📦 Installation

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Setup Instructions

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd realtime-chat-app
   ```

2. **Install dependencies**

   ```bash
   # Install root dependencies
   npm install

   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Create uploads directory**

   ```bash
   cd ../server
   mkdir uploads
   ```

4. **Start the development servers**

   ```bash
   # From the root directory
   npm run dev
   ```

   Or start them separately:

   ```bash
   # Terminal 1 - Server
   cd server
   npm run dev

   # Terminal 2 - Client
   cd client
   npm run dev
   ```

5. **Access the application**
   - Client: http://localhost:5173
   - Server: http://localhost:3001

## 🎯 Usage

### Getting Started

1. Open the application in your browser
2. Enter a username to join the chat
3. Start messaging in the general channel
4. Click on online users to start private conversations

### Features Guide

#### Public Chat

- Type messages in the general chat room
- See when other users are typing
- React to messages with emojis
- Share files and images

#### Private Messaging

- Click on any online user to start a private chat
- Private conversations are separate from public channels
- File sharing works in private chats too

#### File Sharing

- Click the paperclip icon to upload files
- Support for images (displayed inline) and other files
- Maximum file size: 10MB

#### Notifications

- Browser notifications for new messages (requires permission)
- Sound notifications (if audio file is available)
- Notification panel shows message history

## 🏗️ Project Structure

```
realtime-chat-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts (Socket)
│   │   └── main.jsx       # App entry point
│   ├── public/            # Static assets
│   └── package.json       # Client dependencies
├── server/                # Express backend
│   ├── uploads/           # File upload directory
│   ├── server.js          # Main server file
│   └── package.json       # Server dependencies
├── package.json           # Root package.json
└── README.md             # This file
```

## 🔧 Configuration

### Environment Variables

The application uses default configurations, but you can customize:

- **Server Port**: Default 3001 (change in `server/server.js`)
- **Client Port**: Default 5173 (change in `client/vite.config.js`)
- **JWT Secret**: Change `JWT_SECRET` in `server/server.js`
- **Upload Directory**: Default `server/uploads/`

### Socket.io Configuration

- **CORS**: Configured for localhost:5173
- **File Upload**: Max size 10MB
- **Reconnection**: Automatic with exponential backoff

## 🚀 Deployment

### Server Deployment (Render/Railway/Heroku)

1. Deploy the `server` directory
2. Set environment variables:
   - `PORT` (provided by platform)
   - `JWT_SECRET` (your secret key)
3. Ensure uploads directory is created
4. Update CORS origin to your client URL

### Client Deployment (Vercel/Netlify)

1. Build the client: `cd client && npm run build`
2. Deploy the `dist` directory
3. Update API URLs in client code to point to your deployed server

### Full-Stack Deployment

- Server: Railway, Render, or Heroku
- Client: Vercel, Netlify, or GitHub Pages
- Update CORS and API endpoints accordingly

## 🧪 Testing

### Manual Testing Checklist

- [ ] User can join with username
- [ ] Messages send and receive in real-time
- [ ] Private messaging works
- [ ] File upload and sharing
- [ ] Typing indicators appear
- [ ] Message reactions work
- [ ] Online/offline status updates
- [ ] Notifications display
- [ ] Responsive design on mobile
- [ ] Reconnection after disconnect

### Load Testing

- Test with multiple browser tabs
- Verify performance with many concurrent users
- Check memory usage over time

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Socket.io team for excellent real-time communication library
- React team for the amazing frontend framework
- Tailwind CSS for beautiful, utility-first styling
- Lucide for clean, consistent icons

## 📞 Support

If you encounter any issues or have questions:

1. Check the console for error messages
2. Ensure both server and client are running
3. Verify network connectivity
4. Check browser compatibility (modern browsers required)

---

**Happy Chatting! 💬**
