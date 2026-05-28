const Balance = require('../models/balance.model');

exports.updateBalance = async ({ groupId, paidBy, splits, session }) => {
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
    }).session(session);

    if (alreadyOwes) {
      alreadyOwes.amount += amountOwed;
      await alreadyOwes.save({ session });
      continue;
    }

    let reverse = await Balance.findOne({
      group: groupId,
      from: creditor,
      to: debtor,
    }).session(session);

    if (reverse) {
      if (reverse.amount > amountOwed) {
        reverse.amount -= amountOwed;
        await reverse.save({ session });
      } else if (reverse.amount < amountOwed) {
        const newAmount = amountOwed - reverse.amount;
        await reverse.deleteOne({ session });

        await Balance.create([{
          group: groupId,
          from: debtor,
          to: creditor,
          amount: newAmount,
        }], { session });
      } else {
        await reverse.deleteOne({ session });
      }
    } else {
      await Balance.create([{
        group: groupId,
        from: debtor,
        to: creditor,
        amount: amountOwed,
      }], { session });
    }
  }
};

exports.reverseBalance = async ({ groupId, paidBy, splits, session }) => {
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
    }).session(session);

    if (balance) {
      if (balance.amount > amount) {
        balance.amount -= amount;
        await balance.save({ session });
        continue;
      }

      if (balance.amount === amount) {
        await balance.deleteOne({ session });
        continue;
      }

      const reverseAmount = amount - balance.amount;
      await balance.deleteOne({ session });

      await Balance.findOneAndUpdate(
        { group: groupId, from: creditor, to: debtor },
        { $inc: { amount: reverseAmount } },
        { upsert: true, session, returnDocument: 'after' }
      );

    } else {
      await Balance.findOneAndUpdate(
        { group: groupId, from: creditor, to: debtor },
        { $inc: { amount } },
        { upsert: true, session, returnDocument: 'after' }
      );
    }
  }
};