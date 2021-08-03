const express = require("express");
const router = express.Router();
const stripe = require("stripe")(
  "sk_test_51JKJuRGGHRuiYP3jiIb69GT9yXwzcaocJAi0n9T9x1mnUeBEANTClA0gTTg8BC3odUVT9BJMD70uw08OMIWwqijC008zNVEwXM"
);

const StripeTransaction = require("../models/StripeTransaction");

router.post("/payment", async (req, res) => {
  try {
    const response = await stripe.charges.create({
      amount: req.fields.amount * 100,
      currency: "eur",
      product_name: req.fields.title,
      source: req.fields.stripeToken,
    });
    console.log("La réponse de Stripe ====> ", response);
    if (response.status === "succeeded") {
      const newTransaction = await new StripeTransaction(response);
      await newTransaction.save();
      res.status(200).json({ message: "Paiement validé" });
    } else {
      res.status(400).json({ message: "An error occured" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
