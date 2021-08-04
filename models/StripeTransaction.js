const mongoose = require("mongoose");

const StripeTransaction = mongoose.model("StripeTransaction", {
  amount: String,
  currency: String,
  product_name: String,
  source: String,
});

module.exports = StripeTransaction;
