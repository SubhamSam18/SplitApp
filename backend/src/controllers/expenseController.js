const Expense = require("../models/Expense");
const Group = require("../models/Group");

exports.createExpense = async (req, res) => {
  try {
    const { groupId, amount, splitType, splits, paidBy } = req.body;
    const group = await Group.findById(groupId);
    if (!group) {
      res.status(400).json({ message: "Group Not found" });
    }

    if (!group.members.includes(req.user.userId)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const totalAmount = Math.round(amount);
    let computedSplits = [];

    if (splitType === "equal") {
      const size = splits.length;
      const base = totalAmount / size;

      splits.forEach((userId, index) => {
        computedSplits.push({
          user: userId.user,
          amount: base,
        });
      });

      console.log(computedSplits);
    } else if (splitType == "exact") {
      computedSplits = splits.map((s) => ({
        user: s.user,
        amount: Math.round(s.amount),
      }));

      const totalSplit = computedSplits.reduce((acc, s) => acc + s.amount, 0);

      if (totalSplit != totalAmount)
        return res.status(400).json({ message: `Split amount doesnt match` });
    } else {
      return res.status(400).json({ message: "Invalid split type" });
    }

    const payerId = paidBy || req.user.userId;

    if (!group.members.includes(payerId)) {
      return res.status(400).json({
        message: "Payer must be a group member",
      });
    }

    const expense = await Expense.create({
      group: groupId,
      paidBy: payerId,
      amount: totalAmount,
      splitType,
      splits: computedSplits,
    });
    res.status(201).json({
      message: "Expense created",
      expense,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
