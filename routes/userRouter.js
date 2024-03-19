const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const uploadUsingMulter = require("../utils/uploadUsingMulter");
const messageController = require("../controllers/messageController");
const session = require("express-session");

router.get("/register", userController.registerload);
router.post(
  "/register",
  uploadUsingMulter.uploadUserPhotos,
  userController.createUser
);

router.get("/login", userController.loadLogin);
router.post(
  "/login",
  uploadUsingMulter.uploadUserPhotos,
  userController.loginUser
);
router.get("/dashboard", userController.loaddashboard);

router.get("/logout", userController.logout);

router.post("/messages", messageController.messages);

module.exports = router;
