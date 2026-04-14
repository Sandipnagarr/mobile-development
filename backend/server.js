require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
//for websocket//
const http = require("http");
const { Server } = require("socket.io");

connectDB();

//create web socket server
const server = http.createServer(app);

// cors problem//
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
//Runs when a user connects ,socket = that specific user
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);


  //Server listens to message sent from app
  socket.on("message", (msg) => {
    console.log("Client:", msg);

    // reply to same user
   io.emit("message", msg);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});


const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(` Server running on port ${PORT}`);
// });
server.listen(PORT, () => {    /// this plays important role using web socket 
  console.log(`Server running on port ${PORT}`);
});
