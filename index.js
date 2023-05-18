const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const bodyParser = require('body-parser');
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const cors = require("cors");

dotenv.config();

//Database connection
mongoose.connect("mongodb+srv://Citibike:Qwerty.12345@cluster0.a2fd9.mongodb.net/?retryWrites=true&w=majority")
    .then(() => console.log("Connected to DB !"))
    .catch((err) => {
        console.log(err);  
    });

//Middlewares
var allowedOrigins = ['http://localhost:3000',
                      'https://citibike-ecommerce.vercel.app/api'];
app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(null, true);
    }
    return callback(null, true);
  }
}));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

//Routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/order", orderRoute);

app.listen(process.env.PORT || 5000, () => {
    console.log("Server running")
})


