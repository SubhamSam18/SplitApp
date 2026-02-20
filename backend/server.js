require("dotenv").config();
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

const authRoutes = require("./src/routes/authRoutes");
const authMiddleware = require("./src/middleware/authMiddleware");
const groupRoutes = require("./src/routes/groupRoutes");
const expenseRoutes = require("./src/routes/expenseRoutes");
const balanceRoutes = require("./src/routes/balanceRoutes");
const settlementRoutes = require("./src/routes/settlementRoutes");
const summaryRoutes = require("./src/routes/summaryRoutes");

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5001",
    credentials: true,
  }),
);
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
    console.error("❌ MongoDB Connection Failed:");
    console.error(error.message);
  });
