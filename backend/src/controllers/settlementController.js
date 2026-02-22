const Balance = require("../models/Balance");
const Settlement = require("../models/Settlement");
const Expense = require("../models/Expense");

exports.settleGroupPayment = async (req, res) => {
  try {
    const { groupId, from, to, amount } = req.body;

    if (!groupId || !from || !to || !amount)
      return res.status(400).json({ message: "Invalid data!" });

    if (amount <= 0)
      return res.status(400).json({ message: "Invalid amount!" });

    const balance = await Balance.findOne({
      groupId,
      from,
      to,
    });

    if (!balance) return res.status(404).json({ message: "No balance found!" });

    if (amount > balance.amount)
      return res(400).json({ message: "Amount is greater than owed amount" });

    if (amount === balance.amount) {
      await balance.deleteOne();
    } else {
      balance.amount -= amount;
      await balance.save();
    }

    await Settlement.create({
      group: groupId,
      type: "Group",
      from,
      to,
      amount,
      settledBy: req.user.userId,
    });
    res.status(200).json({ message: "Payment Settled!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server error!" });
  }
};

exports.settleFriendsPayment = async (req, res) => {
  try {
    const { to } = req.body;
    const from = req.user._id;
    console.log(to);
    if (!from || !to) return res.status(400).json({ message: "Invalid data!" });

    const balances = await Balance.find({
      $or: [
        { from, to },
        { from: to, to: from },
      ],
    });

    // const balances = await Balance.find({});
    console.log(balances);
    // console.log(balances);
    if (!balances.length)
      return res.status(404).json({ message: "No balances found!" });

    let netAmount = 0;

    balances.forEach((b) => {
      if (b.from.toString() === from.toString()) {
        netAmount -= b.amount;
      } else {
        netAmount += b.amount;
      }
    });

    // await Balance.deleteMany({
    //   $or: [
    //     { from, to },
    //     { from: to, to: from },
    //   ],
    // });
    // await Settlement.create({
    //   type: "Full",
    //   from,
    //   to,
    //   amount: netAmount,
    //   settledBy: req.user.userId,
    // });

    // await Expense.updateMany(
    //   {
    //     status: "active",
    //     $or: [
    //       {
    //         paidBy: from,
    //         "splits.user": to,
    //       },
    //       {
    //         paidBy: to,
    //         "splits.user": from,
    //       },
    //     ],
    //   },
    //   {
    //     $set: { status: "cancelled" },
    //   },
    // );

    res.status(200).json({ message: "Payment Settled!", netAmount });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server error!" });
  }
};
