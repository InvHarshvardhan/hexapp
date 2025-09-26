const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);

// ✅ Setup Socket.IO with CORS enabled
const io = new Server(server, {
  cors: {
    origin: "*",  // during dev, allow everyone
    methods: ["GET", "POST"]
  }
});

// ✅ Serve static files like index.html, css, js
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ✅ Socket.IO listeners
io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  socket.on("sendNotification", (data) => {
    console.log("📨 Message from client:", data.text);
    // Send to everyone else (except sender)
    socket.broadcast.emit("receiveNotification", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// ✅ Railway / Vercel / Heroku - use dynamic PORT
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});