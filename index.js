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

const adscendmediaRoutes = require("./routes/adscendMediaOfferWall");
app.use("/api/adcenOffers", adscendmediaRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
