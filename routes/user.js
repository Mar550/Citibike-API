const User = require("../models/User");
const {verifyToken, verifyTokenAndAut, verifyTokenAndAdmin} = require("./verifyToken");
const router = require("express").Router();
const CryptoJS = require("crypto-js");


// UPDATE User

router.put("/:id", verifyTokenAndAut, async (req, res) => {
    const checkedid = req.params.id;
    if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASS_SECRET_KEY
      ).toString();
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        checkedid.trim(),
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  });


// DELETE User
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  const checkedid = req.params.id;
  try {
    await User.findByIdAndDelete(checkedid.trim());
    res.status(200).json("User deleted !");
  } catch (err) {
    res.status(500).json(err);
  }
});


// FIND User 
router.get("/find/:id", verifyTokenAndAdmin, async (req,res)=>{
  const checkedid = req.params.id;
  try{
    const user = await User.findById(checkedid.trim())
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch(err){
    res.status(500).json(err);
  }
})

//FIND All Users 
router.get("/all", verifyToken, async (req, res) => {
  const query = req.query.new;
  try{
    const users = query
    ? await User.find().limit(5)
    : await User.find();
    res.status(200).json(users);
  } catch(err){
    res.status(500).json(err);
  }
})

// GET User Informations

router.get('/info', verifyTokenAndAdmin, async (req, res)=> {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  try {
    const data = await User.aggregate([
      { $match: { createdAt: {$gte: lastYear }}},
      { 
        $project:{
          month: { $month:"$createdAt"},
        },
      },
      {
        $group:{
          _id:"$month",
          total: { $sum: 1 },
        }
      }
    ]);
    res.status(200).json(data);
  } catch(err){
    res.status(500).json(err);
  }
})

module.exports = router;

