const mongoose = require("mongoose");

const settlementSchema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: false,
    },
    type: {
      type: String,
      enum: ["Group", "Full"],
      required: true,
    },
    sendersName: {
      type: String,
      required: true,
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recieversName: {
      type: String,
      required: true,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    settledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "reversed"],
      default: "active",
    },
    expense: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expense",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Settlement", settlementSchema);
