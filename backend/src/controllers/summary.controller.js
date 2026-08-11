const Expense = require('../models/expense.model');
const Balance = require('../models/balance.model');
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
    });

    // If someone owes me
    balancesTo.forEach((user) => {
      balances[user.from.toString()] =
        (balances[user.from.toString()] || 0) + user.amount;
    });

    for (const userId in balances) {
      if (balances[userId] > 0) {
        youAreOwed += balances[userId];
      } else if (balances[userId] < 0) {
        youOwe += Math.abs(balances[userId]);
      }
    }

    res.status(200).json({
      youAreOwed,
      youOwe,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
