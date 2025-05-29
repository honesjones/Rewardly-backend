// index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();



const app = express();
app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/users');
app.use('/api', userRoutes);

const pointsRoutes = require('./routes/points');
app.use('/api/points', pointsRoutes);

const withdrawalRoutes = require("./routes/withdrawals");
app.use("/api/withdrawals", withdrawalRoutes);



app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

const https = require('https'); // Use https instead of http

// Keep-alive task
function keepAlive() {
  console.log(`Keep-alive task ran at ${new Date().toISOString()}`);
  // Ping internal health endpoint
  https.get('https://rewardly-backend.onrender.com/health', (res) => {
    console.log(`Health check status: ${res.statusCode}`);
  }).on('error', (err) => {
    console.error('Health check failed:', err.message);
  });
}

// Run every 5 minutes (300,000 ms)
setInterval(keepAlive, 300000);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
