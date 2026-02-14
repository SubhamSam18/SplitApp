const Balance = require("../models/Balance");
const Settlement = require("../models/Settlement");

exports.settlePayment = async (req, res) => {
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
      amount,
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
