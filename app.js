const express = require("express");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const userRouter = require("./routes/userRouter");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const session = require("express-session");
const { SESSION_SECRET } = process.env;
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// app.use(session({ secret: SESSION_SECRET }));

mongoose
  .connect("mongodb://0.0.0.0:27017/users")
  .then(() => console.log("DB connection successful"));

app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use("/users", userRouter);

io.on("connection", (socket) => {
  socket.on("user-message", (message) => {
    io.emit("message", message);
  });
});

const filePath = path.resolve(__dirname, "./public/index.html");

app.get("/messages", (req, res) => {
  return res.sendFile(filePath);
});

app.all("*", (req, res, next) => {
  next(new AppError(`cant find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});

module.exports = app;
