const User = require('../models/user.model');
const Balance = require('../models/balance.model');
const Group = require('../models/group.model');

exports.getFriends = async (req, res) => {
  const currentUserId = req.user.userId;
  try {
    const groups = await Group.find({
      members: currentUserId,
    });
    // console.log(groups);
    const userId = new Set();

    groups.forEach((group) => {
      group.members.forEach((friendsId) => {
        if (friendsId.toString() != currentUserId.toString()) {
          userId.add(friendsId.toString());
        }
      });
    });
    // console.log(userId);
    const friends = await User.find({
      _id: { $in: Array.from(userId) },
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
