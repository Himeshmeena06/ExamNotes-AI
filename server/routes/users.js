const express = require("express");

const router = express.Router();

router.get("/me", (_req, res) => {
  res.json({
    name: "Aarav Sharma",
    gems: 420,
    notesGenerated: 36,
    subjectsStudied: 8,
    studyHours: 64,
    generatedQuizzes: 19,
    preparationScore: 85,
    confidenceLevel: 78,
    examReadiness: 82,
    weakTopics: ["Operating Systems", "Numerical Methods"],
    strongTopics: ["DBMS", "Computer Networks"]
  });
});

module.exports = router;
