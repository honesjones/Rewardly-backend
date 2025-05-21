const express = require("express");
const router = express.Router();
const pool = require("../db");
const verifyToken = require("../middlewares/auth");

// POST /api/withdrawals
router.post("/", verifyToken, async (req, res) => {
  const { method, address, amount_points ,ip} = req.body;

  if (!method || !address || !amount_points) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user has enough points
    const userRes = await pool.query("SELECT points FROM users WHERE id = $1", [
      req.user.id,
    ]);
    const currentPoints = userRes.rows[0]?.points || 0;

    if (currentPoints < amount_points) {
      return res.status(400).json({ message: "Not enough points" });
    }

    // Insert withdrawal request
    const insertRes = await pool.query(
      `INSERT INTO withdrawals (user_id, method, address, amount_points,ip) 
       VALUES ($1, $2, $3, $4,$5) RETURNING *`,
      [req.user.id, method, address, amount_points,ip]
    );

    // Deduct points from user
    await pool.query("UPDATE users SET points = points - $1 WHERE id = $2", [
      amount_points,
      req.user.id,
    ]);

    res.status(201).json(insertRes.rows[0]);
  } catch (err) {
    console.error("Withdrawal error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/withdrawals
router.get("/", verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM withdrawals WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Get withdrawals error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
