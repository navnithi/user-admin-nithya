const formidable = require("express-formidable");

const { registerUser, verifyEmail, loginUser, loginOutUser, logOutUser, userProfile } = require("../controllers/users");

const router = require("express").Router();

router.post("/register", formidable(), registerUser);
router.post("/verify-email",  verifyEmail);
router.post("/login", loginUser);
router.get("/logout", logOutUser);
router.get("/profile", userProfile);

module.exports = router;
