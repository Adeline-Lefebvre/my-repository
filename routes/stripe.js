const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const Stripe = require("../models/Stripe");

router.post("/payment", async (req, res) => {
  console.log("Hello");

  try {
    const response = await stripe.charges.create({
      amount: req.fields.price * 100, // en centimes
      currency: "eur",
      description: "La description du produit...",
      source: req.fields.stripeToken,
    });
    console.log("La réponse de Stripe ====> ", response);
    if (response.status === "succeeded") {
      res.status(200).json({ message: "Paiement validé" });
    } else {
      res.status(400).json({ message: "An error occured" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
