const asyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");
const User = require("../models/userModel")
const bcrypt = require("bcrypt")

const hashPassword = async (password) => {

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword
}
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please fill all the fields")
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
        return res.status(400).send({ message: "User already exist" });
        //  throw new Error("User already exist")

    }

    const hashedPassword = await hashPassword(req.body.password)
    //  console.log(hashedPassword)
    const newUser = new User({
        name: name,
        email: email,
        password: hashedPassword,
        pic: pic
    });
    const savedUser = await newUser.save();

    if (savedUser) {
        const token = generateToken(savedUser._doc._id)
        const { password, ...rest } = savedUser._doc
        const response = {
            ...rest,
            token: token
        }
        res.status(200).json(response);
    }
    else {
        throw new Error("Failed to create user")
    }
})


const authUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    // console.log("password match :", isPasswordMatch)

    if (user && isPasswordMatch) {
        const token = generateToken(user._id);
        const { password, ...rest } = user._doc;
        const response = {
            ...rest,
            token: token
        }
        res.status(200).json(response)

    } else {
        throw new Error("Invalid credentials")
    }


});

const allUsers = asyncHandler(async (req, res) => {

    let keyword = req.query.search
        ?
        {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } }
            ]
        }
        :
        {}
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } })
    res.status(200).json(users)
})


module.exports = { registerUser, authUser, allUsers }