const Expense = require('../models/expense.model');
const Group = require('../models/group.model');
const balanceService = require('../services/balance.service');
const Settlement = require('../models/settlement.model');
const mongoose = require("mongoose");
const User = require('../models/user.model');
const Activity = require('../models/activity.model');

exports.createExpense = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const {
      groupId,
      description,
      amount,
      splitType,
      splits,
      paidBy,
      expenseDate,
    } = req.body.data;

    const group = await Group.findById(groupId).session(session);

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
      const share = Math.floor(totalAmount / participants);
      let remainder = totalAmount - share * participants;

      splits.forEach((userId) => {
        let userAmount = share;
        if (remainder > 0) {
          userAmount += 1;
          remainder--;
        }
        computedSplits.push({
          user: userId.user,
          name: userId.name,
          amount: userAmount,
        });
      });
    } else if (splitType == "exact") {
      const totalSplit = splits.reduce((acc, s) => acc + s.amount, 0);
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
    const payerUser = await User.findById(payerId.toString());
    const payerName = payerUser.name;
    // console.log(computedSplits);
    if (!group.members.includes(payerId)) {
      return res.status(400).json({
        message: "Payer must be a group member",
      });
    }

    const expense = await Expense.create(
      [
        {
          group: groupId,
          description: description,
          paidBy: payerId,
          payerName: payerName,
          amount: totalAmount,
          splitType,
          splits: computedSplits,
          expenseDate: expenseDate || Date.now(),
        },
      ],
      { session },
    );

    await balanceService.updateBalance({
      groupId,
      paidBy: payerId,
      splits: computedSplits,
      session,
    });

    const descriptionContent = `${req.user.userName} added an expense of ${totalAmount} for ${description}`;
    await Activity.create(
      [
        {
          groupId: groupId,
          expenseId: expense[0]._id,
          description: descriptionContent,
          amount: totalAmount,
          paidBy: payerId,
          createdBy: req.user.userName,
          splits: computedSplits,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();
    res.status(201).json({
      message: "Expense created",
      expense,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteExpense = async (req, res) => {
  // console.log("delete hit");
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { expenseId } = req.params;
    const expense = await Expense.findById(expenseId).session(session);
    // console.log("Expense: ", expense);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    await balanceService.reverseBalance({
      groupId: expense.group,
      paidBy: expense.paidBy,
      splits: expense.splits,
      session,
    });

    expense.status = "cancelled";
    await expense.save({ session });

    const descriptionContent = `${req.user.userName} deleted the expense of ${expense.amount} for ${expense.description}`;
    await Activity.create(
      [
        {
          groupId: expense.group,
          description: descriptionContent,
          amount: expense.amount,
          paidBy: expense.paidBy,
          createdBy: req.user.userName,
          splits: expense.splits,
        },
      ],
      { session }
    );

    res.status(200).json({
      message: "Expense deleted successfully",
    });
    await session.commitTransaction();
    session.endSession();

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateExpenses = async (req, res) => {
  // console.log("Update Hit!");
  const session = await mongoose.startSession();
  let retries = 5;
  while (retries > 0) {
    session.startTransaction();
    try {
      const { expenseId } = req.params;
      const bodyData = req.body.data || req.body;
      const { amount, paidBy, splitType, splits, expenseDate, description } = bodyData;

      const oldExpense = await Expense.findById(expenseId).session(session);

      if (!oldExpense) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: "Expense not found!" });
      }

      if (oldExpense.status !== "active") {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          message: "Only active expenses can be edited",
        });
      }

      const settlementExists = await Settlement.findOne(
        {
          expense: expenseId,
          status: "active",
        },
      ).session(session);

      if (settlementExists) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          message: "Cannot edit expense with settlements",
        });
      }
      const payerId = paidBy || oldExpense.paidBy;
      const payerUser = await User.findById(payerId.toString()).session(session);
      const payerName = payerUser ? payerUser.name : oldExpense.payerName;

      await balanceService.reverseBalance({
        groupId: oldExpense.group,
        paidBy: oldExpense.paidBy,
        splits: oldExpense.splits,
        session,
      });

      const totalAmount = Math.round(amount);
      let computedSplits = [];

      if (splitType === "equal") {
        if (!splits || splits.length === 0) {
          await session.abortTransaction();
          session.endSession();
          return res.status(400).json({ message: "Participants required" });
        }
        const participants = splits.length;
        const share = Math.floor(totalAmount / participants);
        let remainder = totalAmount - share * participants;

        splits.forEach((userId) => {
          let userAmount = share;
          if (remainder > 0) {
            userAmount += 1;
            remainder--;
          }
          computedSplits.push({
            user: userId.user,
            name: userId.name,
            amount: userAmount,
          });
        });
      } else if (splitType == "exact") {
        const totalSplit = splits.reduce((acc, s) => acc + s.amount, 0);
        if (totalSplit !== totalAmount) {
          await session.abortTransaction();
          session.endSession();
          return res.status(400).json({
            message: "Split amount doesnt match",
          });
        }
        computedSplits = splits;
      } else {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: "Invalid split type" });
      }

      oldExpense.description = description !== undefined ? description : oldExpense.description;
      oldExpense.paidBy = payerId;
      oldExpense.payerName = payerName;
      oldExpense.amount = totalAmount;
      oldExpense.splitType = splitType;
      oldExpense.splits = computedSplits;
      oldExpense.expenseDate = expenseDate || oldExpense.expenseDate || Date.now();
      await oldExpense.save({ session });

      await balanceService.updateBalance({
        groupId: oldExpense.group,
        paidBy: payerId,
        splits: computedSplits,
        session,
      });

      const descriptionContent = `${req.user.userName} updated the expense of ${totalAmount} for ${description !== undefined ? description : oldExpense.description}`;
      const activity = await Activity.findOne({ expenseId: oldExpense._id }).session(session);
      if (activity) {
        activity.description = descriptionContent;
        activity.amount = totalAmount;
        activity.paidBy = payerId;
        activity.splits = computedSplits;
        activity.createdAt = new Date();
        await activity.save({ session });
      } else {
        await Activity.create(
          [
            {
              groupId: oldExpense.group,
              expenseId: oldExpense._id,
              description: descriptionContent,
              amount: totalAmount,
              paidBy: payerId,
              createdBy: req.user.userName,
              splits: computedSplits,
              createdAt: new Date(),
            },
          ],
          { session }
        );
      }

      await session.commitTransaction();
      session.endSession();
      return res.status(200).json({
        message: "Expense updated successfully",
        newExpense: oldExpense,
      });
    } catch (error) {
      await session.abortTransaction();
            session.endSession();
      console.log(error);
      return res.status(500).json({ message: "Server error" });
    }
  }
};

exports.getExpenseById = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const expense = await Expense.findById(expenseId)
      .populate("paidBy", "name email")
      .populate("group", "name");

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json(expense);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
