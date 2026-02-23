const Expense = require("../models/Expense");
const Balance = require("../models/Balance");
exports.getSummary = async (req, res) => {
  try {
    const currentUserId = req.user.userId;
    const balancesFrom = await Balance.find({
      from: currentUserId,
    });
    const balancesTo = await Balance.find({
      to: currentUserId,
    });

    const balances = {};
    let youAreOwed = 0;
    let youOwe = 0;

    //If you owe
    balancesFrom.forEach((user) => {
      balances[user.to.toString()] =
        (balances[user.to.toString()] || 0) - user.amount;
      youOwe += user.amount;
    });

    // If someone owes me
    balancesTo.forEach((user) => {
      balances[user.from.toString()] =
        (balances[user.from.toString()] || 0) + user.amount;
      youAreOwed += user.amount;
    });

    res.status(200).json({
      youAreOwed,
      youOwe,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
