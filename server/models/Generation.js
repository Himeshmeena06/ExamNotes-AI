const mongoose = require("mongoose");

const generationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    type: {
      type: String,
      enum: ["notes", "pyq-analysis", "study-plan", "flashcards", "quiz", "predictions"],
      required: true
    },
    input: { type: Object, required: true },
    output: { type: Object, required: true },
    gemsSpent: { type: Number, default: 25 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Generation", generationSchema);
