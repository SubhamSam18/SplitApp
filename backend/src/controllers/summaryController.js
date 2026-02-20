const mongoose = require("mongoose");
const Balance = require("../models/Balance");

exports.getSummary = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);

    const youOwe = await Balance.aggregate([
      { $match: { from: userId } },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const youAreOwed = await Balance.aggregate([
      { $match: { to: userId } },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);
    res.status(200).json({
      youOwe: youOwe[0]?.total || 0,
      youAreOwed: youAreOwed[0]?.total || 0,
    });
  } catch (error) {
    console.error("Error in getSummary:", error);
    res.status(500).json({ message: "Server error" });
  }
};
