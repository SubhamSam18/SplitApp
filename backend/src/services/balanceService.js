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
    const amountToReverse = split.amount;

    let balance = await Balance.findOne({
      group: groupId,
      from: debtor,
      to: creditor,
    });

    if (balance) {
      if (balance.amount > amountToReverse) {
        balance.amount -= amountToReverse;
        await balance.save();
      } else if (balance.amount < amountToReverse) {
        const newAmount = amountToReverse - balance.amount;
        await balance.deleteOne();

        let reverseBalance = await Balance.findOne({
          group: groupId,
          from: creditor,
          to: debtor,
        });

        if (reverseBalance) {
          reverseBalance.amount += newAmount;
          await reverseBalance.save();
        } else {
          await Balance.create({
            group: groupId,
            from: creditor,
            to: debtor,
            amount: newAmount,
          });
        }
      } else {
        await balance.deleteOne();
      }
    } else {
      let reverseBalance = await Balance.findOne({
        group: groupId,
        from: creditor,
        to: debtor,
      });

      if (reverseBalance) {
        reverseBalance.amount += amountToReverse;
        await reverseBalance.save();
      } else {
        await Balance.create({
          group: groupId,
          from: creditor,
          to: debtor,
          amount: amountToReverse,
        });
      }
    }
  }
};
