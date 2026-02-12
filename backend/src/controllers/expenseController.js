const Expense = require("../models/Expense");
const Group = require("../models/Group");
const balanceService = require("../services/balanceService");

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
      if (!splits || splits.length === 0) {
        return res.status(400).json({ message: "Participants required" });
      }
      const participants = splits.length;
      const share = totalAmount / participants;

      splits.forEach((userId) => {
        computedSplits.push({
          user: userId.user,
          amount: share,
        });
      });

      // console.log(computedSplits);
    } else if (splitType == "exact") {
      const totalSplit = splits.reduce((acc, s) => acc + s.amount, 0);
      // console.log("Total Amount:", totalAmount);
      // console.log("Total Split:", totalSplit);
      if (totalSplit !== totalAmount) {
        return res.status(400).json({
          message: "Split amount doesnt match",
        });
      }
      computedSplits = splits;
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
    await balanceService.updateBalance({
      groupId,
      paidBy: payerId,
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
