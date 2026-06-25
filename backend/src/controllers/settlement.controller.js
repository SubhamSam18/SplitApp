const mongoose = require("mongoose");
const Balance = require('../models/balance.model');
const Settlement = require('../models/settlement.model');
const User = require('../models/user.model');
const Activity = require('../models/activity.model');
const Group = require('../models/group.model');

exports.settleGroupPayment = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const { groupId, from, to, amount } = req.body;

    if (!groupId || !from || !to || !amount) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Invalid data!" });
    }

    if (amount <= 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Invalid amount!" });
    }

    const group = await Group.findById(groupId).session(session);
    if (!group || !group.members.includes(req.user.userId)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({ message: "Unauthorized" });
    }

    const balance = await Balance.findOne({
      group: groupId,
      from,
      to,
    }).session(session);

    if (!balance) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "No balance found!" });
    }

    if (amount > balance.amount) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Amount is greater than owed amount" });
    }

    if (amount === balance.amount) {
      await balance.deleteOne({ session });
    } else {
      balance.amount -= amount;
      await balance.save({ session });
    }

    const fromUser = await User.findById(from).session(session);
    const toUser = await User.findById(to).session(session);

    await Settlement.create(
      [
        {
          group: groupId,
          type: "Group",
          from,
          sendersName: fromUser.name,
          to,
          recieversName: toUser.name,
          amount,
          settledBy: req.user.userId,
        },
      ],
      { session }
    );

    const descriptionContent = `${fromUser.name} settled ₹${amount} with ${toUser.name}`;
    await Activity.create(
      [
        {
          groupId,
          description: descriptionContent,
          amount,
          paidBy: from,
          createdBy: req.user.userName,
          splits: [{ user: to, name: toUser.name, amount }],
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();
    res.status(200).json({ message: "Payment Settled!" });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.log(err);
    return res.status(500).json({ message: "Internal Server error!" });
  }
};

exports.settleFriendsPayment = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const { to, amount } = req.body;
    const from = req.user.userId;
    if (!from || !to) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Invalid data!" });
    }

    const balances = await Balance.find({
      $or: [
        { from, to },
        { from: to, to: from },
      ],
    }).session(session);

    if (!balances.length) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "No balances found!" });
    }

    let netAmount = 0;

    balances.forEach((b) => {
      if (b.from.toString() === from.toString()) {
        netAmount -= b.amount;
      } else {
        netAmount += b.amount;
      }
    });

    if (netAmount === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "No overall balance to settle!" });
    }

    let sender, reciever;
    if (netAmount < 0) {
      sender = req.user.userId;
      reciever = to;
    } else {
      sender = to;
      reciever = req.user.userId;
    }

    const maxSettlementPossible = Math.abs(netAmount);
    const settleAmount = amount ? Number(amount) : maxSettlementPossible;

    if (settleAmount <= 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Invalid amount!" });
    }

    if (settleAmount > maxSettlementPossible) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Amount is greater than overall owed amount" });
    }

    const recieversName = await User.findOne({ _id: reciever }).session(session);
    const sendersName = await User.findOne({ _id: sender }).session(session);

    let remainingAmount = settleAmount;
    
    const senderOwesBalances = balances.filter(
      (b) => b.from.toString() === sender.toString() && b.to.toString() === reciever.toString()
    );

    for (let b of senderOwesBalances) {
      if (remainingAmount <= 0) break;

      const deduction = Math.min(b.amount, remainingAmount);
      b.amount -= deduction;
      remainingAmount -= deduction;

      if (b.amount === 0) {
        await b.deleteOne({ session });
      } else {
        await b.save({ session });
      }

      const descriptionContent = `${sendersName.name} settled ₹${deduction} with ${recieversName.name}`;
      await Activity.create(
        [
          {
            groupId: b.group,
            description: descriptionContent,
            amount: deduction,
            paidBy: sender,
            createdBy: req.user.userName,
            splits: [{ user: reciever, name: recieversName.name, amount: deduction }],
          },
        ],
        { session }
      );
    }

    await Settlement.create(
      [
        {
          type: "Full",
          recieversName: recieversName.name,
          from: sender,
          sendersName: sendersName.name,
          to: reciever,
          amount: settleAmount,
          settledBy: req.user.userId,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();
    res.status(200).json({ message: "Payment Settled!", amount: settleAmount, remainingNetAmount: maxSettlementPossible - settleAmount });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.log(err);
    return res.status(500).json({ message: "Internal Server error!" });
  }
};
