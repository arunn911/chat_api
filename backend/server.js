const express = require("express");
const chats = require("./data/data")
const dotenv = require("dotenv")
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./routes/userRoute")
const chatRoute = require("./routes/chatRoute")
const multer = require("multer")
const path = require("path")



const app = express(); // declare app to use express library

app.use(cors()); // to allow cross orgin requests

app.use(express.json()); // to accept json in body

dotenv.config();  // config .env file values 

const PORT = 5050 || process.env.PORT;  // initialize port 

app.use("/images", express.static(path.join(__dirname, "/images")));

app.listen(PORT, console.log("Server started on", PORT))

// connect the data base to the server
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("Database connection successfull"))
    .catch((err) => console.log(err))





const storage = multer.diskStorage({
    destination:(req,file,cb) => {
        cb(null,"images")
    }, filename:(req,file,cb) =>{
        cb(null,req.body.name)
    },
});

const upload = multer({ storage:storage});

app.post("/api/uploads", upload.single("file"), (req,res) => {
    try{
     res.status(200).send({message:"Image uploaded sucessfully"})
    }catch(err){
        // res.status(500).send({message:"Image upload failed"})
      console.log("err is :",err);
    }
});




// api routes 

app.use("/api/users", userRoute)
app.use("/api/chats", chatRoute)
app.get("/", (req, res) => {
    console.log("req received");
    res.send("Server is running");
})

app.get("/api/chat", (req, res) => {
    console.log("req for :", chats)
    res.json(chats);
})

app.get("/api/chat/:id", (req, res) => {
    const singleChat = chats.find((e) => e._id === req.params.id)
    res.json(singleChat);
})