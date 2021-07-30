const express = require("express");
const router = express.Router();
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const cloudinary = require("cloudinary").v2;

const User = require("../models/User");

router.post("/user/signup", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.fields.email });
    if (user !== null) {
      res
        .status(409)
        .json({ message: "Cet email est déjà associé à un compte" });
    } else {
      if (req.fields.username === undefined) {
        res
          .status(409)
          .json({ message: "Le nom d'utilisateur n'est pas rensigné" });
      } else {
        const salt = uid2(16);
        const hash = SHA256(req.fields.password + salt).toString(encBase64);
        const token = uid2(16);

        const newUser = await new User({
          email: req.fields.email,
          account: {
            username: req.fields.username,
            phone: req.fields.phone,
          },
          token: token,
          hash: hash,
          salt: salt,
        });

        if (req.files.picture) {
          const result = await cloudinary.uploader.upload(
            req.files.picture.path,
            {
              folder: `/vinted/offers/${newUser._id}`,
            }
          );
          newUser.avatar = { secure_url: result.secure_url };
        }

        await newUser.save();
        res.status(200).json({
          email: newUser.email,
          account: newUser.account,
          token: newUser.token,
        });
      }
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/user/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.fields.email });
    if (user !== null) {
      const newHash = SHA256(req.fields.password + user.salt).toString(
        encBase64
      );
      if (user.hash === newHash) {
        res
          .status(200)
          .json({ message: `Welcome back ${user.account.username} !` });
      } else {
        res.status(400).json({ message: "Identifiants incorrects." });
      }
    } else {
      res.status(400).json({ message: "Identifiants incorrects." });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
