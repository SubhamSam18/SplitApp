const Expense = require("../models/expense.model");
const Settlement = require("../models/settlement.model");
const mongoose = require("mongoose");

exports.getUserAnalytics = async (req, res) => {
    try {
        const userId = req.user.userId;
        const month = Number(req.params.month);
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        const startOfMonth = new Date(today.getFullYear(), month - 1, 1);
        const endOfMonth = new Date(today.getFullYear(), month, 0);
        const startOfYear = new Date(today.getFullYear(), 0, 1);
        const endOfYear = new Date(today.getFullYear(), 11, 31);

        const getTotalAmount = async (filter) => {
            const expenses = await Expense.find(filter);
            return expenses.reduce((sum, exp) => sum + exp.amount, 0);
        };
        const getRecievedAmount = async (filter) => {
            const expenses = await Settlement.find(filter);
            return expenses.reduce((sum, exp) => sum + exp.amount, 0);
        };


        const todaysExpense = await getTotalAmount({
            paidBy: new mongoose.Types.ObjectId(userId),
            createdAt: { $gte: startOfDay, $lt: endOfDay },
            status: "active"
        });
        const thisMonthsExpense = await getTotalAmount({
            paidBy: new mongoose.Types.ObjectId(userId),
            createdAt: { $gte: startOfMonth, $lt: endOfMonth },
            status: "active"
        });
        const thisYearsExpense = await getTotalAmount({
            paidBy: new mongoose.Types.ObjectId(userId),
            createdAt: { $gte: startOfYear, $lt: endOfYear },
            status: "active"
        });
        const amountRecievedThisMonth = await getRecievedAmount({
            to: new mongoose.Types.ObjectId(userId),
            createdAt: { $gte: startOfMonth, $lt: endOfMonth },
            status: "active"
        })
        const amountPaidThisMonth = await getRecievedAmount({
            from: new mongoose.Types.ObjectId(userId),
            createdAt: { $gte: startOfMonth, $lt: endOfMonth },
            status: "active"
        })
        const amountRecievedThisYear = await getRecievedAmount({
            to: new mongoose.Types.ObjectId(userId),
            createdAt: { $gte: startOfYear, $lt: endOfYear },
            status: "active"
        });
        const amountPaidThisYear = await getRecievedAmount({
            from: new mongoose.Types.ObjectId(userId),
            createdAt: { $gte: startOfYear, $lt: endOfYear },
            status: "active"
        });


        return res.status(200).json({
            todaysExpense,
            thisMonthsExpense,
            thisYearsExpense,
            amountRecievedThisMonth,
            amountPaidThisMonth,
            amountRecievedThisYear,
            amountPaidThisYear,
        });
    } catch (err) {
        console.log(err);
    }
}