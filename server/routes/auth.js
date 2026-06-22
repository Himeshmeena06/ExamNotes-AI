const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.get("/google", (_req, res) => {
  res.json({
    message: "Configure passport-google-oauth20 with GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET for production."
  });
});

router.post("/demo-login", (_req, res) => {
  const user = {
    id: "demo-user",
    name: "Aarav Sharma",
    email: "aarav@example.com",
    gems: 100,
    avatarUrl: "https://api.dicebear.com/8.x/initials/svg?seed=Aarav"
  };
  const token = jwt.sign(user, process.env.JWT_SECRET || "demo-secret", { expiresIn: "7d" });
  res.json({ token, user });
});

module.exports = router;
