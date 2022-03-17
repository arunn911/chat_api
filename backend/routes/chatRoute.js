const authenticate = require("../middlewares/authMiddleware");
const Chat = require("../models/chatModel");
const router = require("express").Router();


router.get("/", async (req,res) =>{

    res.send("<h1>Chat page</h1>");
})

router.post("/", authenticate, )



module.exports = router;