const Expense = require("../models/Expense");
const Group = require("../models/Group");
const balanceService = require("../services/balanceService");
const Settlement = require("../models/Settlement");

exports.createExpense = async (req, res) => {
  try {
    const { groupId, amount, splitType, splits, paidBy, expenseDate } =
      req.body;
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(400).json({ message: "Group Not found" });
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
      expenseDate: expenseDate || Date.now(),
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

exports.deleteExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const expense = await Expense.findById(expenseId);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    await balanceService.reverseBalance({
      groupId: expense.group,
      paidBy: expense.paidBy,
      splits: expense.splits,
    });

    expense.status = "cancelled";
    await expense.save();

    res.status(200).json({
      message: "Expense deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

exports.updateExpenses = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const { amount, paidBy, splitType, splits, expenseDate } = req.body;

    const oldExpense = await Expense.findById(expenseId);

    if (!oldExpense) {
      return res.status(404).json({ message: "Expense not found!" });
    }

    if (oldExpense.status !== "active") {
      return res.status(400).json({
        message: "Only active expenses can be edited",
      });
    }

    const settlementExists = await Settlement.findOne({
      expense: expenseId,
      status: "active",
    });

    if (settlementExists) {
      return res.status(400).json({
        message: "Cannot edit expense with settlements",
      });
    }
    const payerId = paidBy || oldExpense.paidBy;

    await balanceService.reverseBalance({
      groupId: oldExpense.group,
      paidBy: oldExpense.paidBy,
      splits: oldExpense.splits,
    });

    oldExpense.status = "deleted";
    await oldExpense.save();

    const totalAmount = Math.round(amount);
    let computedSplits = [];

    if (splitType === "equal") {
      const share = totalAmount / splits.length;
      splits.forEach((obj) => {
        computedSplits.push({
          user: obj.user,
          amount: share,
        });
      });
    } else if (splitType === "exact") {
      const totalSplit = splits.reduce((acc, s) => acc + Number(s.amount), 0);

      if (totalSplit !== totalAmount) {
        return res.status(400).json({ message: "Split amount mismatch" });
      }
      computedSplits = splits;
    } else {
      return res.status(400).json({ message: "Invalid split type" });
    }

    const newExpense = await Expense.create({
      group: oldExpense.group,
      paidBy: payerId,
      amount: totalAmount,
      splitType,
      splits: computedSplits,
      expenseDate: expenseDate || Date.now(),
    });

    await balanceService.updateBalance({
      groupId: oldExpense.group,
      paidBy: payerId,
      splits: computedSplits,
    });

    res.status(200).json({
      message: "Expense updated successfully",
      newExpense,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
