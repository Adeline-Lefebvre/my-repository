const mongoose = require("mongoose");

const StripeTransaction = mongoose.model("StripeTransaction", {
  amount: String,
  currency: String,
  description: String,
  source: String,
});

module.exports = StripeTransaction;
