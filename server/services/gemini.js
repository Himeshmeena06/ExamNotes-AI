const { GoogleGenerativeAI } = require("@google/generative-ai");

const demoPayload = {
  summary: "High-yield exam output generated in demo mode.",
  topics: [
    { label: "Transport Layer", weightage: 25, confidence: 91 },
    { label: "Network Layer", weightage: 22, confidence: 88 },
    { label: "Data Link Layer", weightage: 18, confidence: 84 }
  ],
  questions: [
    { question: "Explain CRC with an example.", marks: 5, probability: 92 },
    { question: "Compare Go-Back-N and Selective Repeat ARQ.", marks: 10, probability: 87 },
    { question: "Define framing and list its methods.", marks: 2, probability: 81 }
  ],
  notes: [
    "Focus on definitions, diagrams, formulas, and repeated PYQ patterns.",
    "Prepare one labeled diagram per unit and one comparison table per protocol.",
    "Revise numerical problems after theory because they carry fast-scoring marks."
  ]
};

function getModel() {
  if (!process.env.GEMINI_API_KEY) return null;
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
}

async function generateJson(prompt, fallback = demoPayload) {
  const model = getModel();
  if (!model) return fallback;

  const result = await model.generateContent(`${prompt}\nReturn strict JSON only.`);
  const text = result.response.text().replace(/```json|```/g, "").trim();
  return JSON.parse(text);
}

module.exports = { generateJson, demoPayload };
