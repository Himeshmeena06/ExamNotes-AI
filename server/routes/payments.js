const express = require("express");
const Razorpay = require("razorpay");
const { PACKAGES } = require("../services/gems");

const router = express.Router();

router.get("/packages", (_req, res) => {
  res.json(PACKAGES);
});

router.post("/create-order", async (req, res) => {
  const selected = PACKAGES[req.body.packageId];
  if (!selected) return res.status(400).json({ message: "Invalid gems package." });

  if (!process.env.RAZORPAY_KEY_ID) {
    return res.json({ demo: true, order: { id: "order_demo", ...selected } });
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });

  const order = await razorpay.orders.create({
    amount: selected.amount,
    currency: "INR",
    receipt: `examnotes_${Date.now()}`
  });
  res.json({ order, package: selected });
});

module.exports = router;
