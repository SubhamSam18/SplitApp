const mongoose = require("mongoose");
const Balance = require('../models/balance.model');
const Settlement = require('../models/settlement.model');
const User = require('../models/user.model');
const Activity = require('../models/activity.model');

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

    const balance = await Balance.findOne({
      groupId,
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
    const { to } = req.body;
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
    let sender, reciever;
    if (netAmount < 0) {
      sender = req.user.userId;
      reciever = to;
    } else {
      sender = to;
      reciever = req.user.userId;
    }
    const recieversName = await User.findOne({ _id: reciever }).session(session);
    const sendersName = await User.findOne({ _id: sender }).session(session);

    await Balance.deleteMany(
      {
        $or: [
          { from, to },
          { from: to, to: from },
        ],
      },
      { session }
    );

    await Settlement.create(
      [
        {
          type: "Full",
          recieversName: recieversName.name,
          from: sender,
          sendersName: sendersName.name,
          to: reciever,
          amount: Math.abs(netAmount),
          settledBy: req.user.userId,
        },
      ],
      { session }
    );

    for (const b of balances) {
      if (b.amount > 0) {
        const fromUser = await User.findById(b.from).session(session);
        const toUser = await User.findById(b.to).session(session);
        const descriptionContent = `${fromUser.name} settled ₹${b.amount} with ${toUser.name}`;
        
        await Activity.create(
          [
            {
              groupId: b.group,
              description: descriptionContent,
              amount: b.amount,
              paidBy: b.from,
              createdBy: req.user.userName,
              splits: [{ user: b.to, name: toUser.name, amount: b.amount }],
            },
          ],
          { session }
        );
      }
    }

    await session.commitTransaction();
    session.endSession();
    res.status(200).json({ message: "Payment Settled!", netAmount });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.log(err);
    return res.status(500).json({ message: "Internal Server error!" });
  }
};
