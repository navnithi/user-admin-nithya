const session = require("express-session");
const formidable = require("express-formidable");
const userRouter = require("express").Router();

const {
  registerUser,
  verifyEmail,
  loginUser,
  logOutUser,
  userProfile,
  deleteUser,
  updateUser,
  forgetPassword,
  resetPassword,
} = require("../controllers/users");
const dev = require("../config");
const { isLoggedIn, isLoggedOut } = require("../middlewares/auth");

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
userRouter.post("/login", isLoggedOut, loginUser);
userRouter.get("/logout", isLoggedIn, logOutUser);

userRouter.get("/", isLoggedIn, userProfile);
userRouter.delete("/", isLoggedIn, deleteUser);
userRouter.put("/", isLoggedIn, formidable(), updateUser);

userRouter.post("/forget-password", forgetPassword);
userRouter.post("/reset-password", resetPassword);

module.exports = userRouter;
