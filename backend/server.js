require("dotenv").config({ quiet: true });
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

const authRoutes = require('./src/routes/auth.routes');
const authMiddleware = require('./src/middleware/auth.middleware');
const groupRoutes = require('./src/routes/group.routes');
const expenseRoutes = require('./src/routes/expense.routes');
const balanceRoutes = require('./src/routes/balance.routes');
const settlementRoutes = require('./src/routes/settlement.routes');
const summaryRoutes = require('./src/routes/summary.routes');
const friendsRoutes = require('./src/routes/friends.routes');
const analyticsRoutes = require('./src/routes/analytics.routes');

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Authentication Successful!",
    user: req.user,
  });
});
app.use("/api/groups", groupRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/balances", balanceRoutes);
app.use("/api/settle", settlementRoutes);
app.use("/api/summary", summaryRoutes);
app.use("/api/friends", friendsRoutes);
app.use("/api/analytics", analyticsRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB Connection Failed:");
    console.error(error.message);
  });
