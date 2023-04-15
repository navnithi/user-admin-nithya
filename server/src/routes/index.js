const { registerUser } = require("../controllers/users");

const router = require("express").Router();

router.post("/register", registerUser)

module.exports= router;