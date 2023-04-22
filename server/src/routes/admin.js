const formidable = require("express-formidable");
const session = require("express-session");
const adminRouter = require("express").Router();


const dev = require("../config");
const { isLoggedIn, isLoggedOut } = require("../middlewares/auth");
const { loginAdmin, logoutAdmin, getAllUsers, deleteUserByAdmin } = require("../controllers/admin");
const { registerUser } = require("../controllers/users");
const isAdmin = require("../middlewares/isAdmin");

adminRouter.use(
  session({
    name: "admin_session",
    secret: dev.app.sessionSecretKey || asdweed,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 10 * 6000 },
  })
);

adminRouter.post("/login", isLoggedOut, loginAdmin);
adminRouter.get("/logout", isLoggedIn, logoutAdmin);
adminRouter.get("/dashboard", isLoggedIn, getAllUsers);
adminRouter.post("/register", formidable(), registerUser);
adminRouter.delete("/dashboard/:id", isLoggedIn, isAdmin,deleteUserByAdmin);


module.exports = adminRouter;
