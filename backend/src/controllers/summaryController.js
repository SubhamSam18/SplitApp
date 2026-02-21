const Expense = require("../models/Expense");
exports.getSummary = async (req, res) => {
  try {
    const currentUserId = req.user.userId;

    const allExpense = await Expense.find({
      status: "Active",
      $or: [{ paidBy: currentUserId }, { "splits.user": currentUserId }],
    });

    const balances = {};

    allExpense.forEach((expense) => {
      expense.splits.forEach((split) => {
        const splitUserId = split.user.toString();

        if (expense.paidBy.toString() === currentUserId.toString()) {
          if (splitUserId !== currentUserId.toString()) {
            balances[splitUserId] = (balances[splitUserId] || 0) + split.amount;
          }
        } else if (splitUserId === currentUserId.toString()) {
          balances[expense.paidBy.toString()] =
            (balances[expense.paidBy.toString()] || 0) - split.amount;
        }
      });
    });

    let youAreOwed = 0;
    let youOwe = 0;

    Object.values(balances).forEach((amount) => {
      if (amount > 0) {
        youAreOwed += amount;
      } else {
        youOwe += Math.abs(amount);
      }
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
