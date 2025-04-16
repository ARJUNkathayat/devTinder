const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Userschema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
  },
  about: {
    type: String,
    default: "This is default value of about. You can change it.",
  },
  Country: {
    type: String,
  },
}, {
  timestamps: true,
});

// 🔐 JWT method
Userschema.methods.getjwt = function () {
  return jwt.sign({ id: this.id }, "DevTinder@2005", { expiresIn: "1d" });
};

// 🔐 Password validation
Userschema.methods.validatePassword = async function (passwordInputByUser) {
  return await bcrypt.compare(passwordInputByUser, this.password);
};

// ✅ Export model AFTER adding methods
const User = mongoose.model("User", Userschema);
module.exports = User;
