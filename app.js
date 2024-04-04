const express = require("express");

const messageRouter = require("./routers/messageRoutes");
const chatRouter = require("./routers/chatRoutes");

const app = express();
app.use(express.json());
// app.use(express.static("${__dirname}/public"));

// ==== For uptimeRobot Monitor ====
app.get("/ping", (req, res) => {
  res.send("pong 🎯 Your API is running perfectly Well. 😎");
});

// ==== Mounting Routers ====
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/chat", chatRouter);

app.startServer = async () => {
  try {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server Started. Listening on URL: 127.0.0.1:${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = app;
