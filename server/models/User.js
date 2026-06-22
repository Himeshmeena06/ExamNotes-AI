const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    avatarUrl: String,
    gems: { type: Number, default: 100 },
    role: { type: String, enum: ["student", "admin"], default: "student" },
    stats: {
      notesGenerated: { type: Number, default: 0 },
      subjectsStudied: { type: Number, default: 0 },
      studyHours: { type: Number, default: 0 },
      quizzesGenerated: { type: Number, default: 0 }
    },
    insight: {
      preparationScore: { type: Number, default: 85 },
      confidenceLevel: { type: Number, default: 78 },
      examReadiness: { type: Number, default: 82 },
      weakTopics: [String],
      strongTopics: [String]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
