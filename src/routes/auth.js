const express = require("express")
const authrouter = express.Router()

const {validSignUpData} = require("../utils/Validation")

const User = require("../Models/User")


const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser");

const bcrypt = require("bcrypt")

authrouter.post("/Signup", async (req, res) => {
  try {
    validSignUpData(req);

    const password = req.body.password;

    // 🔒 Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const { firstName, lastName, gender, about, email, country } = req.body;
    const data = new User({
      firstName,
      lastName,
      gender,
      about,
      email,
      country,
      password: hashedPassword
    });

    await data.save();
    res.send("User signed up successfully");
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(400).send("Signup failed");
  }
});

authrouter.post("/Login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      throw new Error("No user found");
    }

    const isPasswordCorrect = await user.validatePassword(password);
    if (!isPasswordCorrect) {
      throw new Error("Invalid credentials");
    }

    const token = user.getjwt(); // You don't need await if not returning a Promise
    res.cookie("token", token);
    res.send("Login Successful");

  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

authrouter.post("/Logout", async(req,res)=>{
    res.cookie("token",null)
    res.send("Logout successfully")
})
module.exports = authrouter