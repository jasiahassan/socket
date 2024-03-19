const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.registerload = catchAsync(async (req, res, next) => {
  res.render("register");
});

exports.createUser = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  await user.save(),
    res.render("register", { message: "registration successful" });
});

exports.loadLogin = catchAsync(async (req, res, next) => {
  res.render("login");
});

exports.loginUser = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return next(new AppError("please provide email and password", 400));
  }

  const user = await User.findOne({ email: email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("incorrect email or password", 401));
  }
  req.session.user = user;
  res.redirect("/users/dashboard");
});

exports.loaddashboard = catchAsync(async (req, res, next) => {
  const users = await User.find({ _id: { $nin: [req.session.user._id] } });
  res.render("dashboard", {
    user: req.session.user,
    users: users,
  });
});

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect("/");
};
