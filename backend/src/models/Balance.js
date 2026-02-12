const mongoose = require("mongoose");

const balanceSchema = new mongoose.Schema({
  group: {
    type: mongoose.Types.ObjectId,
    ref: "Group",
    required: true,
  },
  from: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  to: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Balance", balanceSchema);
