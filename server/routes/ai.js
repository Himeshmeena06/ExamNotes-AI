const express = require("express");
const multer = require("multer");
const { generateJson, demoPayload } = require("../services/gemini");
const { getCost } = require("../services/gems");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 12 * 1024 * 1024 } });

router.post("/notes", async (req, res) => {
  const prompt = `Create exam-focused notes with theory, definitions, formulas, diagrams, mnemonics, tables, and important questions for: ${JSON.stringify(req.body)}`;
  const output = await generateJson(prompt, {
    ...demoPayload,
    mode: req.body.mode || "Complete Notes",
    subject: req.body.subject || "Computer Networks"
  });
  res.json({ gemsSpent: getCost("notes"), output });
});

router.post("/pyq-analysis", upload.array("papers", 8), async (req, res) => {
  const prompt = `Analyze previous year question papers and extract repeated topics, questions, frequency, weightage, and predictions. Metadata: ${JSON.stringify(req.body)}`;
  const output = await generateJson(prompt, {
    mostAskedTopic: "CPU Scheduling",
    appeared: 8,
    weightage: 22,
    repeatedQuestions: demoPayload.questions,
    topicFrequency: demoPayload.topics
  });
  res.json({ filesReceived: req.files.length, gemsSpent: getCost("pyq-analysis"), output });
});

router.post("/study-plan", async (req, res) => {
  const days = Number(req.body.days || 15);
  const plan = Array.from({ length: Math.min(days, 30) }, (_, index) => ({
    day: index + 1,
    focus: demoPayload.topics[index % demoPayload.topics.length].label,
    task: index % 3 === 2 ? "PYQ practice + quiz" : "Notes + diagrams + flashcards"
  }));
  res.json({ gemsSpent: getCost("study-plan"), output: { days, plan } });
});

router.post("/quiz", async (req, res) => {
  res.json({
    gemsSpent: getCost("quiz"),
    output: {
      title: `${req.body.topic || "High Weightage"} Quiz`,
      questions: [
        { type: "MCQ", question: "Which layer handles reliable end-to-end delivery?", answer: "Transport Layer" },
        { type: "True/False", question: "CRC is used for error detection.", answer: "True" },
        { type: "Fill", question: "The unit of data at Data Link Layer is called ____.", answer: "Frame" }
      ]
    }
  });
});

router.post("/flashcards", async (req, res) => {
  res.json({
    gemsSpent: getCost("flashcards"),
    output: [
      { front: "What is CRC?", back: "A polynomial-based error detection method used in data transmission." },
      { front: "ARQ full form", back: "Automatic Repeat reQuest." },
      { front: "Exam trick", back: "Always draw the frame format when explaining Data Link Layer services." }
    ]
  });
});

module.exports = router;
