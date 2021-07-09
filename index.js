const express = require("express");
const formidable = require("express-formidable");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;

const app = express();
app.use(formidable());

mongoose.connect("mongodb://localhost/vinted", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

cloudinary.config({
  cloud_name: "didine",
  api_key: "773545984858169",
  api_secret: "4FTdLtxTMcGWkJwZPHiDah_s9zU",
});

const userRoutes = require("./routes/user");
const offerRoutes = require("./routes/offer");
app.use(userRoutes);
app.use(offerRoutes);

app.all("*", (req, res) => {
  res.status(404).json({ message: "Page not found" });
});

app.listen(3000, () => {
  console.log("Server has started");
});
