const productRoutes = require("./products");
const customerRoutes = require("./customers");
const orderRoutes = require("./orders");
const reviewRoutes = require("./reviews");
const adminRoutes = require("./admin");
const express=require("express")

const router = express.Router();


router.use("/api/products", productRoutes);
router.use("/api/customers", customerRoutes);
router.use("/api/orders", orderRoutes);
router.use("/api/reviews", reviewRoutes);
router.use("/api/admin", adminRoutes);


export default router;

