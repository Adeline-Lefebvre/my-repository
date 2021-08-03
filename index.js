const express = require("express");
const formidable = require("express-formidable");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(formidable());
app.use(
  cors(
    (cors.CorsOptions = {
      origin: "*",
    })
  )
);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const userRoutes = require("./routes/user");
const offerRoutes = require("./routes/offer");
app.use(userRoutes);
app.use(offerRoutes);

app.post("/payment", async (req, res) => {
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

// TODO
// Sauvegarder la transaction dans une BDD MongoDB

app.all("*", (req, res) => {
  res.status(404).json({ message: "Page not found" });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server has started");
});
