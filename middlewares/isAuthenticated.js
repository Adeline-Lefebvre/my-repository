const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
  const token = req.headers.authorization.replace("Bearer ", "");
  const user = await User.findOne({ token: token }).select("account");
  if (user) {
    req.user = user;
    next();
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = isAuthenticated;
