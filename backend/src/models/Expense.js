const mongoose = require("mongoose");

const groupExpense = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    splitType: {
      type: String,
      enum: ["equal", "exact"],
      default: "equal",
    },
    splits: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        amount: {
          type: Number,
        },
      },
    ],
    status: {
      type: String,
      enum: ["active", "cancelled", "deleted"],
      default: "active",
    },
    updatedFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expense",
      default: null,
    },
    expenseDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Expense", groupExpense);
