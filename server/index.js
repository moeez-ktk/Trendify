require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const productRoutes = require("./routes/products");
const customerRoutes = require("./routes/customers");
const orderRoutes = require("./routes/orders");
const reviewRoutes = require("./routes/reviews");
const adminRoutes = require("./routes/admin");

let db;

//express app
const app = express();

//middleware
app.use(express.json());

const corsOptions = (req, res, next) => {
  // CORS headers
  res.header(
    "Access-Control-Allow-Origin",
    "https://trendify-bese27c.vercel.app/"
  ); // restrict it to the required domain
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  // Set custom headers for CORS
  res.header(
    "Access-Control-Allow-Headers",
    "Content-type,Accept,X-Custom-Header"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  return next();
};

app.use(cors(corsOptions()));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

//routes
app.get("/", (req, res) => {
  res.json({ mssg: "Welcome to the app" });
});
app.use("/api/products", productRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);

// //connect to DB
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("connected to database");
//     // listen to port
//     app.listen(process.env.PORT, () => {
//       console.log("listening for requests on port", process.env.PORT);
//     });
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// If the script is not running as part of a test, start the server
if (process.env.NODE_ENV !== "test") {
  // const mongoose = require('mongoose');

  //connect to DB
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("connected to database");
      // listen to port
      app.listen(process.env.PORT, () => {
        console.log("listening for requests on port", process.env.PORT);
      });
    })
    .catch((error) => {
      console.error("Error connecting to the database:", error);
    });
}

module.exports = app;
