const User = require("../models/User");
const Balance = require("../models/Balance");

exports.getFriends = async (req, res) => {
  const currentUserId = req.user.userId;
  try {
    const friends = await User.find({
      _id: { $ne: currentUserId },
    });

    const balancesFrom = await Balance.find({
      from: currentUserId,
    });
    const balancesTo = await Balance.find({
      to: currentUserId,
    });

    const balances = {};

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
    // console.log(balances);
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
