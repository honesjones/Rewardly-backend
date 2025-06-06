// routes/points.js
const express = require("express");
const router = express.Router();
const pool = require("../db");
const verifyToken = require("../middlewares/auth");


// GET /api/points - Get point history for logged-in user
router.get("/", verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      "SELECT id, source, point As points, created_at FROM points WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching point history:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// adbluemedia
router.get("/adbluemedia", async (req, res) => {
  const { s1, payout, offer_id, offer_name ,ip} = req.query;

  if (!s1 || !payout) {
    return res.status(400).json({ message: "Missing s1 or payout" });
  }

  try {
    // Lookup user by public_id
    const userResult = await pool.query(
      "SELECT id FROM users WHERE public_id = $1",
      [s1]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const userId = userResult.rows[0].id;
    const points = Math.round(parseFloat(payout) * 0.4 * 1000); // Adjust conversion
    const offerSource = offer_name || "AdblueMedia"; 

    // Insert into points table
    const result = await pool.query(
      "INSERT INTO points (user_id, source, point ,ip) VALUES ($1, $2, $3,$4) RETURNING *",
      [userId, offerSource, points,ip]
    );

    // Update user's total points
    await pool.query(
      "UPDATE users SET points = points + $1 WHERE id = $2",
      [points, userId]
    );

    res.status(200).json({ message: "Postback processed", data: result.rows[0] });
  } catch (err) {
    console.error("Postback error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// cpagrip
router.get("/cpagrip", async (req, res) => {
  const { subid, payout, offer } = req.query;

  if (!subid || !payout) {
    return res.status(400).json({ message: "Missing s1 or payout" });
  }

  try {
    // Lookup user by public_id
    const userResult = await pool.query(
      "SELECT id FROM users WHERE public_id = $1",
      [subid]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const userId = userResult.rows[0].id;
    const points = Math.round(parseFloat(payout) * 0.4 * 1000); // Adjust conversion
    const offerSource =" CpaGrip : " + offer; 

    // Insert into points table
    const result = await pool.query(
      "INSERT INTO points (user_id, source, point) VALUES ($1, $2, $3) RETURNING *",
      [userId, offerSource, points]
    );

    // Update user's total points
    await pool.query(
      "UPDATE users SET points = points + $1 WHERE id = $2",
      [points, userId]
    );

    res.status(200).json({ message: "Postback processed", data: result.rows[0] });
  } catch (err) {
    console.error("Postback error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// MmWall
router.get("/MmWall", async (req, res) => {
  const { user_id,payout,offername ,user_ip} = req.query;

  if (!user_id || !payout) {
    return res.status(400).json({ message: "Missing s1 or payout" });
  }

  try {
    // Lookup user by public_id
    const userResult = await pool.query(
      "SELECT id FROM users WHERE public_id = $1",
      [user_id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const userId = userResult.rows[0].id;
    const points = Math.round(parseFloat(payout) * 0.4 * 1000); // Adjust conversion
    const offerSource = offername || "MM wall";

    // Insert into points table
    const result = await pool.query(
      "INSERT INTO points (user_id, source, point ,ip) VALUES ($1, $2, $3,$4) RETURNING *",
      [userId, offerSource, points,user_ip]
    );

    // Update user's total points
    await pool.query(
      "UPDATE users SET points = points + $1 WHERE id = $2",
      [points, userId]
    );

    res.status(200).json({ message: "Postback processed", data: result.rows[0] });
  } catch (err) {
    console.error("Postback error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// AyeT-studios
router.get("/AyetStudios", async (req, res) => {
  const {external_identifier,payout_usd, offer_name ,ip} = req.query;

  if (!external_identifier || !payout_usd) {
    return res.status(400).json({ message: "Missing s1 or payout" });
  }

  try {
    // Lookup user by public_id
    const userResult = await pool.query(
      "SELECT id FROM users WHERE public_id = $1",
      [external_identifier]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const userId = userResult.rows[0].id;
    const points = Math.round(parseFloat(payout_usd) * 0.4 * 1000); // Adjust conversion
    const offerSource = offer_name || "AyeT Studios"; 

    // Insert into points table
    const result = await pool.query(
      "INSERT INTO points (user_id, source, point ,ip) VALUES ($1, $2, $3,$4) RETURNING *",
      [userId, offerSource, points,ip]
    );

    // Update user's total points
    await pool.query(
      "UPDATE users SET points = points + $1 WHERE id = $2",
      [points, userId]
    );

    res.status(200).json({ message: "Postback processed", data: result.rows[0] });
  } catch (err) {
    console.error("Postback error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Adgem
router.get("/Adgem", async (req, res) => {
  const {player_id,payout, offer_name ,ip} = req.query;

  if (!player_id || !payout) {
    return res.status(400).json({ message: "Missing s1 or payout" });
  }

  try {
    // Lookup user by public_id
    const userResult = await pool.query(
      "SELECT id FROM users WHERE public_id = $1",
      [player_id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const userId = userResult.rows[0].id;
    const points = Math.round(parseFloat(payout) * 0.4 * 1000); // Adjust conversion
    const offerSource = offer_name || "Adgem"; 

    // Insert into points table
    const result = await pool.query(
      "INSERT INTO points (user_id, source, point ,ip) VALUES ($1, $2, $3,$4) RETURNING *",
      [userId, offerSource, points,ip]
    );

    // Update user's total points
    await pool.query(
      "UPDATE users SET points = points + $1 WHERE id = $2",
      [points, userId]
    );

    res.status(200).json({ message: "Postback processed", data: result.rows[0] });
  } catch (err) {
    console.error("Postback error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// AdGatemedia
router.get("/AdGatemedia", async (req, res) => {
  const {player_id,payout, offer_name ,ip} = req.query;

  if (!player_id || !payout) {
    return res.status(400).json({ message: "Missing s1 or payout" });
  }

  try {
    // Lookup user by public_id
    const userResult = await pool.query(
      "SELECT id FROM users WHERE public_id = $1",
      [player_id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const userId = userResult.rows[0].id;
    const points = Math.round(parseFloat(payout) * 0.4 * 1000); // Adjust conversion
    const offerSource = offer_name || "AdGatemedia"; 

    // Insert into points table
    const result = await pool.query(
      "INSERT INTO points (user_id, source, point ,ip) VALUES ($1, $2, $3,$4) RETURNING *",
      [userId, offerSource, points,ip]
    );

    // Update user's total points
    await pool.query(
      "UPDATE users SET points = points + $1 WHERE id = $2",
      [points, userId]
    );

    res.status(200).json({ message: "Postback processed", data: result.rows[0] });
  } catch (err) {
    console.error("Postback error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Mylead
router.get("/Mylead", async (req, res) => {
  const {player_id,payout, offer_name ,ip} = req.query;

  if (!player_id || !payout) {
    return res.status(400).json({ message: "Missing s1 or payout" });
  }

  try {
    // Lookup user by public_id
    const userResult = await pool.query(
      "SELECT id FROM users WHERE public_id = $1",
      [player_id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const userId = userResult.rows[0].id;
    const points = Math.round(parseFloat(payout) * 0.4 * 1000); // Adjust conversion
    const offerSource = offer_name || "Mylead"; 

    // Insert into points table
    const result = await pool.query(
      "INSERT INTO points (user_id, source, point ,ip) VALUES ($1, $2, $3,$4) RETURNING *",
      [userId, offerSource, points,ip]
    );

    // Update user's total points
    await pool.query(
      "UPDATE users SET points = points + $1 WHERE id = $2",
      [points, userId]
    );

    res.status(200).json({ message: "Postback processed", data: result.rows[0] });
  } catch (err) {
    console.error("Postback error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// MyChips
router.get("/Mychips", async (req, res) => {
  const {player_id,payout, offer_name ,ip} = req.query;

  if (!player_id || !payout) {
    return res.status(400).json({ message: "Missing s1 or payout" });
  }

  try {
    // Lookup user by public_id
    const userResult = await pool.query(
      "SELECT id FROM users WHERE public_id = $1",
      [player_id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const userId = userResult.rows[0].id;
    const points = Math.round(parseFloat(payout) * 0.4 * 1000); // Adjust conversion
    const offerSource = offer_name || "MyChips"; 

    // Insert into points table
    const result = await pool.query(
      "INSERT INTO points (user_id, source, point ,ip) VALUES ($1, $2, $3,$4) RETURNING *",
      [userId, offerSource, points,ip]
    );

    // Update user's total points
    await pool.query(
      "UPDATE users SET points = points + $1 WHERE id = $2",
      [points, userId]
    );

    res.status(200).json({ message: "Postback processed", data: result.rows[0] });
  } catch (err) {
    console.error("Postback error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// AdscendMedia
router.get("/AdscendMedia", async (req, res) => {
  const {player_id,payout, offer_name ,ip} = req.query;

  if (!player_id || !payout) {
    return res.status(400).json({ message: "Missing s1 or payout" });
  }

  try {
    // Lookup user by public_id
    const userResult = await pool.query(
      "SELECT id FROM users WHERE public_id = $1",
      [player_id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const userId = userResult.rows[0].id;
    const points = Math.round(parseFloat(payout) * 0.4 * 1000); // Adjust conversion
    const offerSource = offer_name || "AdscendMedia"; 

    // Insert into points table
    const result = await pool.query(
      "INSERT INTO points (user_id, source, point ,ip) VALUES ($1, $2, $3,$4) RETURNING *",
      [userId, offerSource, points,ip]
    );

    // Update user's total points
    await pool.query(
      "UPDATE users SET points = points + $1 WHERE id = $2",
      [points, userId]
    );

    res.status(200).json({ message: "Postback processed", data: result.rows[0] });
  } catch (err) {
    console.error("Postback error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;