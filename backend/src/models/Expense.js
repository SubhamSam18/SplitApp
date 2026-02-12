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
  },
  { timestamps: true },
);

module.exports = mongoose.model("Expense", groupExpense);
