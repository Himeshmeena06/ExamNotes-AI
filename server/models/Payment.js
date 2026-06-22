const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    packageId: { type: String, required: true },
    gems: { type: Number, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    status: { type: String, enum: ["created", "paid", "failed"], default: "created" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
