const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const Document = require('./models/Document');

require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/collab';
const PORT = process.env.PORT || 4000;

mongoose.connect(MONGO).then(() => console.log('Mongo connected')).catch(console.error);

// Simple API to create or load a document
app.post('/api/document', async (req, res) => {
  const { roomId } = req.body;
  if (!roomId) return res.status(400).json({ error: 'roomId required' });
  let doc = await Document.findOne({ roomId });
  if (!doc) doc = await Document.create({ roomId, content: '' });
  return res.json(doc);
});

app.get('/api/document/:roomId', async (req, res) => {
  const { roomId } = req.params;
  let doc = await Document.findOne({ roomId });
  if (!doc) doc = await Document.create({ roomId, content: '' });
  return res.json(doc);
});

// Socket.IO real-time logic
io.on('connection', (socket) => {
  console.log('socket connected', socket.id);

  socket.on('join-room', async ({ roomId, userName }) => {
    socket.join(roomId);
    socket.data.userName = userName || 'Anonymous';
    socket.data.roomId = roomId;

    // send current document content
    let doc = await Document.findOne({ roomId });
    if (!doc) doc = await Document.create({ roomId, content: '' });
    socket.emit('doc-init', { content: doc.content });

    // notify others
    const clients = await io.in(roomId).fetchSockets();
    const users = clients.map(s => ({ id: s.id, name: s.data.userName }));
    io.in(roomId).emit('presence', users);
  });

  // receive content updates from clients (debounced on client)
  socket.on('doc-update', async ({ roomId, content }) => {
    // save to DB
    await Document.findOneAndUpdate({ roomId }, { content, updatedAt: new Date() }, { upsert: true });
    // broadcast to others in room
    socket.to(roomId).emit('doc-update', { content });
  });

  socket.on('disconnecting', async () => {
    const roomId = socket.data.roomId;
    if (roomId) {
      // update presence
      setTimeout(async () => {
        const clients = await io.in(roomId).fetchSockets();
        const users = clients.map(s => ({ id: s.id, name: s.data.userName }));
        io.in(roomId).emit('presence', users);
      }, 50);
    }
  });

});

server.listen(PORT, () => console.log(`Server listening on ${PORT}`));