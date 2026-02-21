const Expense = require("../models/Expense");
const User = require("../models/User");

exports.getFriends = async (req, res) => {
  const currentUserId = req.user.userId;
  try {
    const friends = await User.find();
    const allExpense = await Expense.find({
      status: "Active",
      $or: [{ paidBy: currentUserId }, { "splits.user": currentUserId }],
    });

    const balances = {};
    friends.forEach((user) => {
      balances[user._id.toString()] = 0;
    });

    allExpense.forEach((expense) => {
      expense.splits.forEach((split) => {
        const splitUserId = split.user.toString();

        // If the current user paid and others owe you
        if (expense.paidBy.toString() === currentUserId.toString()) {
          if (splitUserId != currentUserId.toString()) {
            balances[splitUserId] += split.amount;
          }
        }
        //when someone else paid
        else if (splitUserId === currentUserId.toString()) {
          balances[expense.paidBy.toString()] -= split.amount;
        }
      });
    });
    const result = friends.map((users) => {
      const userId = users._id.toString();
      const balance = balances[userId] || 0;
      return {
        ...users._doc,
        balance: balance,
      };
    });

    // console.log(result);
    res.status(200).json(result);
  } catch (err) {
    return res
      .status(404)
      .json({ message: "Friends or Transactions not found!" });
  }
};
