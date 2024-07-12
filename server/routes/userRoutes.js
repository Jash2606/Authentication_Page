const express = require("express");
const User = require("../models/userModel");
const bycrypt = require("bcryptjs");
const router = express.Router();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", async (req, res) => {
    try{
        const userExists = await User.findOne({
            email: req.body.email
        });
        if(userExists){
            res.send({
                success: false,
                message: 'User already exists'            
            })
        }
        const salt = await bycrypt.genSalt(10);
        const hashpassword = await bycrypt.hash(req.body.password, salt);
        req.body.password = hashpassword;
        const newUser = new User(req.body);
        await newUser.save();

        res.send({
            success: true,
            message: 'User added successfully'
        })
        // res.json('User added successfully' );
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
        res.json(error);
    }

});

router.post("/login", async (req, res) => {
    const user = await User.findOne({
        email: req.body.email
    });

    if( !user ){
        res.send({
        success: false,
        message: 'User not found'
        });
    }

    const validPassword = await bycrypt.compare(req.body.password, user.password);
    if(!validPassword){
        res.send({
        success: false,
        message: 'Invalid Password'
        });
    }
    
    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET , {expiresIn: '1y'});

    res.send({
        success: true,
        message: 'User logged in successfully',
        token: token
    });

});

router.get('/get-current-user' ,authMiddleware , async (req, res) => {
    try{
        const user = await User.findById(req.body.userId).select("-password");
        res.send({
            success: true,
            message: 'You are Authorized',
            data : user
        });
    } catch(error){
        console.log(error);
        res.send({
            success: false,
            message: error.message
        });
    }

});

module.exports = router;