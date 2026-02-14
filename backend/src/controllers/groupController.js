const Group = require("../models/Group");
const Expense = require("../models/Expense");
const Balance = require("../models/Balance");
const Settlement = require("../models/Settlement");

exports.createGroup = async (req, res) => {
  try {
    const { name, members } = req.body;
    const group = await Group.create({
      name,
      createdBy: req.user.userId,
      members: [req.user.userId, ...members],
    });
    console.log("Group: " + group);
    res.status(201).json({ message: "Group Created" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getUserGroup = async (req, res) => {
  try {
    const groups = await Group.find({
      members: req.user.userId,
    }).populate("members", "name email");

    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

exports.addMember = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { members } = req.body;
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found!" });
    }

    if (!group.members.includes(req.user.userId))
      return res.status(403).json({ message: "Not Authorized!" });

    const newMembers = members.filter(
      (memberId) => !group.members.includes(memberId),
    );

    group.members.push(...newMembers);
    await group.save();

    res.status(200).json({
      message: "Members added successfully",
      group,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.groupSummary = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findOne(groupId).populate("member", "name email");

    if (!groupId) {
      return res.status(404).json({ message: "Group not found!" });
    }

    const expenses = await Expense.find({
      group: groupId,
      status: "Active",
    });

    const totalExpense = expenses.reduce((acc, exp) => acc + exp.amount, 0);

    const balances = Balance.find({
      group: groupId,
      amount: { $gt: 0 },
    })
      .populate("from", "name email")
      .populate("to", "name email");

    const memberNet = {};

    groups.members.forEach((member) => {
      memberNet[member._id] = {
        userId: member._id,
        name: member.name,
        email: member.email,
        netBalance: 0,
      };
    });

    balances.forEach((balance) => {
      memberNet[balance.from.toString()].netBalance -= balance.amount;
      memberNet[balance.to.toString()].netBalance += balance.amount;
    });

    res.status(200).json({
      group: {
        id: group._id,
        name: group.name,
      },
      totalExpense,
      balances,
      memberSummary: Object.values(memberNet),
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.groupActivity = async (req, res) => {
  try {
    const { groupId } = req.params;

    const expenses = await Expense.find({
      group: groupId,
      status: "Active",
    })
      .populate("paidBy", "name email")
      .sort({ expenseDate: -1 });

    const settlements = await Settlement.find({
      group: groupId,
      status: "Active",
    })
      .populate("from", "name email")
      .populate("to", "name email")
      .sort({ createdAt: -1 });

    const expenseActivities = expenses.map((exp) => ({
      type: "expense",
      id: exp._id,
      date: exp.expenseDate,
      amount: exp.amount,
      paidBy: exp.paidBy,
      splitType: exp.splitType,
    }));

    const settlementActivities = settlements.map((settlement) => ({
      type: "settlement",
      id: settlement._id,
      from: settlement.from,
      to: settlement.to,
      amount: settlement.amount,
      date: settlement.createdAt,
    }));

    const activity = [...expenseActivities, ...settlementActivities].sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );

    res.status(200).json(activity);
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
