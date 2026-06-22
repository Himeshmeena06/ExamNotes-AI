require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const aiRoutes = require("./routes/ai");
const paymentRoutes = require("./routes/payments");
const userRoutes = require("./routes/users");

const app = express();
const PORT = process.env.PORT || 8080;
const publicDir = path.join(__dirname, "..", "public");

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(rateLimit({ windowMs: 60 * 1000, max: 120 }));

app.use(express.static(publicDir));

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/users", userRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", product: "ExamNotes AI" });
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

async function start() {
  if (process.env.MONGODB_URI) {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
  } else {
    console.log("MONGODB_URI missing; running with demo API responses.");
  }

  app.listen(PORT, () => {
    console.log(`ExamNotes AI running at http://localhost:${PORT}`);
  });
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
