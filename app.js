const express = require("express");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
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

// ==== UnHandled Routes ====
app.all("*", (req, res, next) => {
  next(
    new AppError(
      `Can't find ${req.originalUrl} on this server. Jessan. 😎😎😎`,
      404
    )
  );
});

// ==== Global Express Error Handler ====
app.use(globalErrorHandler);

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
