// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);

// ✅ Socket.IO with CORS setup
const io = new Server(server, {
  cors: {
    origin: "*",  // Allow any frontend (GitHub Pages, Railway, etc.)
    methods: ["GET", "POST"]
  }
});

// ✅ Serve static files (index.html, css, js if needed)
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ✅ Socket.IO events
io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  // Receive from client
  socket.on("sendNotification", (data) => {
    console.log("📨 Message from client:", data);

    // Broadcast to everyone else
    socket.broadcast.emit("receiveNotification", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// ✅ Railway uses environment PORT
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});