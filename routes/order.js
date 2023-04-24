const router = require("express").Router();
const { json } = require("body-parser");
const Order = require("../models/Order");
const {verifyToken, verifyTokenAndAut, verifyTokenAndAdmin} = require("./verifyToken");


//CREATE Order
router.post("/create", verifyToken, async (req, res) => {
    const newOrder = new Order(req.body);
    try{
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);
    } catch (err) {
        res.status(500).json(err);
    }
});

//UPDATE order
router.put("/:id", verifyToken, async(req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            {new: true}
        );
        res.status(200).json(updatedOrder);
    } catch(err) {
        res.status(500).json(err);
    }
})

//GET Order
router.get("/find/:id", async(req, res) =>{
    try {
        const order = await Order.findById(req.params.id);
        res.status(200).json(order); 
    } catch(err) {
        res.status(500).json(err);
    }
})

//GET ALL Orders

router.get("/findall", verifyTokenAndAdmin, async(req,res) => {
    try {
        const order = await Order.find()
        res.status(200).json(order);
    } catch (err){
        res.status(500).json(err);
    }
})

//DELETE Order
router.delete("/:id", verifyTokenAndAut, async (req, res) => {
    try{
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json("Order Deleted");
    } catch(err) {
        res.status(500).json(err);
    }
});

/* OTHER FUNCTIONS */

// GET amount of Income 

router.get("/income", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

    try {
      const income = await Order.aggregate([
        { $match: { createdAt: { $gte: previousMonth } } },
        {
          $project: {
            month: { $month: "$createdAt" },
            sales: "$amount",
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: "$sales" },
          },
        },
      ]);
      res.status(200).json(income);
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports = router;