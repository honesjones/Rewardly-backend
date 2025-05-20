// utils/generatePublicId.js
const pool = require("../db");

async function generateUniquePublicId() {
  let isUnique = false;
  let publicId;

  while (!isUnique) {
    publicId = Math.floor(10000 + Math.random() * 90000000).toString(); // 5–8 digits
    const result = await pool.query("SELECT 1 FROM users WHERE public_id = $1", [publicId]);
    isUnique = result.rowCount === 0;
  }

  return publicId;
}

module.exports = generateUniquePublicId;
