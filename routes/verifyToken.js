const jwt = require("jsonwebtoken");


//Middleware 
const verifyToken = (req,res,next)=>{
    const authHeader = req.headers.token
    if(authHeader){
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err,user)=>{
            if(err) res.status(403).json("Invalid Token");
            req.user = user;
            next();
        })
    } else { 
        return res.status(401).json("Authentication failed");
    }
}

const verifyTokenAndAut = (req,res,next)=>{
    verifyToken(req,res,() => {
        if(req.user.id === req.params.id || req.user.isAdmin){
            next()
        } else {
            res.status(403).json("You are not allowed to do that")
        }
    })
}

const verifyTokenAndAdmin = (req,res,next)=>{
    verifyToken(req,res,() => {
        if(req.user.isAdmin){
            next();
        } else {
            res.status(403).json("You are not allowed to do that")
        }
    })
}



module.exports = {verifyToken, verifyTokenAndAut, verifyTokenAndAdmin};