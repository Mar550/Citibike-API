const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken"); 
var mongoose = require('mongoose');
const Joi = require("joi");
const bcrypt = require("bcrypt")
const {verifyToken, verifyTokenAndAut, verifyTokenAndAdmin} = require("./verifyToken");


// REGISTER route
router.post("/register", async (req,res)=>{
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES
        .encrypt(req.body.password, process.env.PASS_SECRET_KEY)
        .toString()
    });
    // Add error message in case informations are uncomplete
    try {
        const savedUser = await user.save();
        console.log(savedUser);
        res.status(201).json(savedUser)
    } catch(err){
        res.status(500).json(err);
        console.log(err);
    }
});


// LOGIN Route 2
router.post("/login", async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      !user && res.status(401).json("Wrong credentials!");
  
      const hashedPassword = CryptoJS.AES.decrypt(
        user.password,
        process.env.PASS_SECRET_KEY
      );
      const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
  
      OriginalPassword !== req.body.password &&
        res.status(401).json("Wrong credentials!");
  
      const accessToken = jwt.sign(
        {
          id: user._id,
          isAdmin: user.isAdmin,
        },
        process.env.JWT_SECRET_KEY,
        {expiresIn:"3d"}
      );
  
      const { password, ...otherData } = user;
  
      res.status(200).json({...otherData, accessToken});
    } catch (err) {
      res.status(500).json(err);
    }
  });

  let refreshTokens = [];

  router.post("/logout", verifyToken, (req,res) =>{
    const refreshToken = req.body.token; 
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken)
    res.status(200).json("Logout successful...!")
  })

module.exports = router;