const express = require("express");
const { registerUser, authUser, allUsers } = require("../controllers/userController");
const authenticate = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", registerUser)

router.post("/login", authUser)

router.get("/", authenticate, allUsers)

module.exports = router;