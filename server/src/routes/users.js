const formidable = require("express-formidable");
const session = require("express-session");
const userRouter = require("express").Router();

const { registerUser, verifyEmail, loginUser, loginOutUser, logOutUser, userProfile } = require("../controllers/users");
const dev = require("../config");



userRouter.use(
  session({
    name: "user_session",
    secret: dev.app.sessionSecretKey || asdfwrew123,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 10 * 6000 },
  })
);

userRouter.post("/register", formidable(), registerUser);
userRouter.post("/verify-email", verifyEmail);
userRouter.post("/login", loginUser);
userRouter.get("/logout", logOutUser);
userRouter.get("/profile", userProfile);

module.exports = userRouter;
