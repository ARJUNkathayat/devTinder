const jwt = require("jsonwebtoken");
const User = require("../Models/User");

const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).send("No token provided");
    }

    const decodedObj = jwt.verify(token, "DevTinder@2005");
    const user = await User.findById(decodedObj.id);

    if (!user) {
      throw new Error("User not found");
    }

    req.user = user; // Optional: makes the user accessible in the next middleware
    next();
  } catch (err) {
    res.status(401).send("Authentication failed: " + err.message);
  }
};

module.exports = { userAuth };
