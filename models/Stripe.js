const mongoose = require("mongoose");

const Stripe = mongoose.model("Stripe", {
  amount: String,
  currency: String,
  description: String,
  source: String,
});

module.exports = Stripe;
