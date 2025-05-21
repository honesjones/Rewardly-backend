// routes/users.js
const express = require("express");
const router = express.Router();
const pool = require("../db");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middlewares/auth");
const generateUniquePublicId = require("../utils/generatePublicId");
// POST /api/auth
router.post("/auth", async (req, res) => {
  const { email, name, referred_by ,ip} = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    // Check if user exists
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    let user;
    if (result.rows.length === 0) {
      // Create new user
      const publicId = await generateUniquePublicId();
      const insert = await pool.query(
        "INSERT INTO users (email, name,public_id,referred_by ,ip ) VALUES ($1, $2,$3,$4,$5) RETURNING *",
        [email, name,publicId,referred_by || null ,ip]
      );
      user = insert.rows[0];
    } else {
      user = result.rows[0];
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({ token, user });
  } catch (err) {
    console.error("Auth error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/me", verifyToken, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [
      req.user.id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/add-points", verifyToken, async (req, res) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  try {
    const result = await pool.query(
      "UPDATE users SET points = points + $1 WHERE id = $2 RETURNING points",
      [amount, req.user.id]
    );
    res.json({ message: "Points added", points: result.rows[0].points });
  } catch (err) {
    console.error("Add points error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
