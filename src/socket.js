const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const app = express();
const { addUser, removeUser, getUser, getUsersInRoom } = require("./users");

app.use(cors());

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.on("join", async ({ player, id }, callback) => {
    const { newUser, error } = addUser({
      id: socket.id,
      name: player,
      room: id,
    });
    if (error) return callback(error);
    await socket.join(newUser.room);
    io.to(newUser.room).emit("roomData", {
      users: getUsersInRoom(newUser.room),
    });
  });
  socket.on("start", ({ data, message, roomCode }) => {
    let from = getUser(socket.id),
      users = getUsersInRoom(roomCode);
    const to = users.filter((user) => user.id !== from.id);
    socket.to(to.id).to(roomCode).emit("receive", {
      data,
      from: 2,
      message,
    });
  });
  socket.on("send msg", ({ data, message, id, roomCode }) => {
    let from = getUser(socket.id),
      users = getUsersInRoom(roomCode);
    const to = users.filter((user) => user.id !== from.id);
    socket.to(to.id).to(roomCode).emit("receive", {
      data,
      from: id,
      message,
    });
  });
  socket.on("update", ({ data, id, roomCode }) => {
    let from = getUser(socket.id),
      users = getUsersInRoom(roomCode);
    const to = users.filter((user) => user.id !== from.id);
    socket.to(to.id).to(roomCode).emit("receive", {
      data,
      from: id,
    });
  });
  socket.on("bito", ({ data, id, roomCode }) => {
    let from = getUser(socket.id),
      users = getUsersInRoom(roomCode);
    const to = users.filter((user) => user.id !== from.id);
    socket.to(to.id).to(roomCode).emit("receive", {
      data,
      from: id,
    });
  });
  socket.on("pickAll", ({ data, id, roomCode }) => {
    let from = getUser(socket.id),
      users = getUsersInRoom(roomCode);
    const to = users.filter((user) => user.id !== from.id);
    socket.to(to.id).to(roomCode).emit("receive", {
      data,
      from: id,
    });
  });
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user)
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
  });
  socket.on("disc", () => {
    const user = removeUser(socket.id);
    if (user)
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
  });
  socket.on("win", (roomCode) => {
    io.to(roomCode).emit("roomData", {
      room: roomCode,
      users: getUsersInRoom(roomCode),
      bool: true,
    });
  });
});

// запускаем сервер
server.listen(PORT, () => {
  console.log(`Server ready. Port: ${PORT}`);
});

// const adminNameSpace = io.off("/admin");
// adminNameSpace.on("connect", (socket) => {
//   socket.on("join", (data) => {
//     socket.join(data.room);
//     adminNameSpace
//       .in(data.room)
//       .emit("chat message", `New Person joined the ${data.room} room`);
//   });
//   socket.on("disconnect", () => {
//     console.log("user disconnected");
//   });
//   socket.on("chat message", (data) => {
//     console.log("message" + data.msg);
//     adminNameSpace.in(data.room).emit("chat message", data.msg);
//   });
// });
