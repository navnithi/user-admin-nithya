const formidable = require("express-formidable");

const { registerUser, verifyEmail } = require("../controllers/users");

const router = require("express").Router();

router.post("/register", formidable(), registerUser);
router.post("/verify-email",  verifyEmail);

module.exports = router;
