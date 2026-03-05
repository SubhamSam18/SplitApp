const Balance = require("../models/Balance");

exports.updateBalance = async ({ groupId, paidBy, splits }) => {
  for (const split of splits) {
    if (split.user.toString() === paidBy.toString()) {
      continue;
    }
    const debtor = split.user;
    const creditor = paidBy;
    const amountOwed = split.amount;

    let alreadyOwes = await Balance.findOne({
      group: groupId,
      from: debtor,
      to: creditor,
    });

    if (alreadyOwes) {
      alreadyOwes.amount += amountOwed;
      await alreadyOwes.save();
      continue;
    }

    let reverse = await Balance.findOne({
      group: groupId,
      from: creditor,
      to: debtor,
    });

    if (reverse) {
      if (reverse.amount > amountOwed) {
        reverse.amount -= amountOwed;
        await reverse.save();
      } else if (reverse.amount < amountOwed) {
        const newAmount = amountOwed - reverse.amount;
        await reverse.deleteOne();

        await Balance.create({
          group: groupId,
          from: debtor,
          to: creditor,
          amount: newAmount,
        });
      } else {
        await reverse.deleteOne();
      }
    } else {
      await Balance.create({
        group: groupId,
        from: debtor,
        to: creditor,
        amount: amountOwed,
      });
    }
  }
};

exports.reverseBalance = async ({ groupId, paidBy, splits }) => {
  for (const split of splits) {
    if (split.user.toString() === paidBy.toString()) {
      continue;
    }
    const debtor = split.user;
    const creditor = paidBy;
    const amount = split.amount;

    let balance = await Balance.findOne({
      group: groupId,
      from: debtor,
      to: creditor,
    });

    if (balance) {
      if (balance.amount > amount) {
        balance.amount -= amount;
        await balance.save();
        continue;
      }

      if (balance.amount === amount) {
        await balance.deleteOne();
        continue;
      }

      const reverseAmount = amount - balance.amount;
      await balance.deleteOne();

      await Balance.findOneAndUpdate(
        { group: groupId, from: creditor, to: debtor },
        { $inc: { amount: reverseAmount } },
        { upsert: true }
      );

    } else {
      await Balance.findOneAndUpdate(
        { group: groupId, from: creditor, to: debtor },
        { $inc: { amount } },
        { upsert: true }
      );
    }
  }
};