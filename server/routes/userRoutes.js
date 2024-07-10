const express = require("express");
const User = require("../models/userModel");
const bycrypt = require("bcryptjs");
const router = express.Router();

router.post("/register", async (req, res) => {
    try{
        const userExists = await User.findOne({
            email: req.body.email
        });
        if(userExists){
            return res.status(400).json('User already exists');
        }
        const salt = await bycrypt.genSalt(10);
        const hashpassword = await bycrypt.hash(req.body.password, salt);
        req.body.password = hashpassword;
        const newUser = new User(req.body);
        await newUser.save();
        res.status(200).json('User added successfully' );
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
    
    res.send({
        success: true,
        message: 'User logged in successfully'
    });

});


module.exports = router;