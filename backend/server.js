const express = require('express');
const dotenv = require('dotenv');
const { chats } = require('./data/data');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const postRoutes = require('./routes/PostRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const path = require('path');

dotenv.config();
connectDB();
const app = express();

app.use(express.json()); // accept JSON data

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/posts', postRoutes);

// ----deployment----
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname1, '/frontend/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname1, 'frontend', 'build', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('api is running successfully');
  });
}

// --deployment----

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server start on port ${PORT}`));

// ----------socket.io service --------
let users = [];

const addUser = (user1, socketId) => {
  !users.some((user) => user._id === user1._id) &&
    users.push({ user1, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: {
    origin: 'http://localhost:3000',
  },
});

io.on('connection', (socket) => {
  socket.on('setup', (userData) => {
    socket.join(userData._id);
    socket.emit('connected');
  });

  socket.on('join chat', (room) => {
    socket.join(room);
    console.log('user join room ' + room);
  });

  socket.on('new message', (newMessageRecieved) => {
    let chat = newMessageRecieved.chat;

    if (!chat.users) return console.log('chat.users not define');

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;
      socket.in(user._id).emit('message recieved', newMessageRecieved);
    });
  });

  //get userId and socketId from user
  socket.on('addUser', (user) => {
    addUser(user, socket.id);
    console.log(socket.id);
    io.emit('getUsers', users);
  });

  //when disconnect
  socket.on("disconnect", () => {
    console.log('user disconnected');
    removeUser(socket.id);
    io.emit('getUsers', users);
    console.log(socket.id);
    socket.leave(userData._id);
  });

  // socket.off('setup', () => {
  //   console.log('user disconnected');
  //   removeUser(socket.id);
  //   io.emit('getUsers', users);
  //   console.log(socket.id);
  //   socket.leave(userData._id);
  // });
});
