// routes/points.js
const express = require("express");
const router = express.Router();
const pool = require("../db");
const verifyToken = require("../middlewares/auth");

// POST /api/points - Add points for a user
router.post("/", verifyToken, async (req, res) => {
  const { source, points } = req.body;
  const userId = req.user.id;

  if (!source || !points) {
    return res.status(400).json({ message: "Source and points are required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO points (user_id, source, point) VALUES ($1, $2, $3) RETURNING *",
      [userId, source, points]
    );

    await pool.query(
      "UPDATE users SET points = points + $1 WHERE id = $2",
      [points, userId]
    );
    res.status(201).json({ message: "Points added", data: result.rows[0] });
  } catch (err) {
    console.error("Error adding points:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// GET /api/points - Get point history for logged-in user
router.get("/", verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      "SELECT id, source, points, created_at FROM points WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching point history:", err);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;