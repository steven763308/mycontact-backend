const asyncHandler = require("express-async-handler");
const bcrypt =require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

//@desc Register a user
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
    const{username, email, password} = req.body;
    if(!username || !email || !password){
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    const userExists = await User.findOne({where:{email}});
    if(userExists){
        res.status(400);
        throw new Error("User already registered!");
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password: ", hashedPassword);
    const user = await User.create({
        username,
        email,
        password: hashedPassword,
    });

    console.log(`User created ${user}`);
    if(user){
        res.status(201).json({
            id: user.id,
            username: user.username,
            email: user.email
        });
    }else{
        res.status(400);
        throw new Error("User data us not valid");
    }
    res.json({message: "Register the user"});
});

//@desc Login user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    console.log("Email: ", email);
    if(!email || !password){
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    const user = await User.findOne({where:{email}});
    //compare password with hashedpassword
    if(user && (await bcrypt.compare(password, user.password))){
        const accessToken = jwt.sign({
            user: {
                username: user.username,
                email: user.email,
                id: user.id,
            },
        }, 
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: "30m"}
    );
        res.status(200).json({accessToken});
    }else{
        res.status(401);
        throw new Error("Email or Password is not valid");
    }
});

//@desc Current user info
//@route POST /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
    res.json(req.user);
});

getUserProfile = asyncHandler(async (req, res) => {
    const user = req.user
    res.json({
        name: user.name,
        email: user.email,
        username: user.username,
    });
});

module.exports = {registerUser, loginUser, currentUser, getUserProfile};