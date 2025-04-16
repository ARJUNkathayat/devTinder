const express = require("express");
const profilerouter  = express.Router();
const bcrypt = require("bcrypt")

const {userAuth} = require("../Middlewares/auth");
const User = require("../Models/User");

profilerouter.get("/profile/view", userAuth, async (req, res) => {
    try {
      // ✅ Use user from middleware
      const user = req.user;
      res.send(`Token verified. You are logged in as ${user.firstName}`);
    } catch (err) {
      console.error("Profile error:", err.message);
      res.status(500).send("Server error");
    }
  });

  
  profilerouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
      const id = req.user.id;
      const { firstName, lastName, gender, country, about } = req.body;
  
      const updatedUser = await User.findByIdAndUpdate(
        id,
        {
          firstName,
          lastName,
          gender,
          Country: country,
          about,
        },
        { new: true } // ✅ This returns the updated document
      );
  
      res.send({
        message: "Profile updated successfully",
        user: updatedUser,
      });
    } catch (err) {
      res.status(500).send({ message: "Error updating profile", error: err.message });
    }
  });
  profilerouter.patch("/profile/edit/password", userAuth, async (req, res) => {
    try {
      const id = req.user.id;
      const currentPasswordInput = req.body.password;
      const newPasswordInput = req.body.newPassword;
  
      const user = await User.findById(id);
      if (!user) throw new Error("User not found");
  
      // ✅ Validate old password
      const isPasswordCorrect = await bcrypt.compare(currentPasswordInput, user.password);
      if (!isPasswordCorrect) {
        throw new Error("Previous password is not correct");
      }
  
      // ✅ Hash new password
      const hashedPassword = await bcrypt.hash(newPasswordInput, 10);
  
      // ✅ Update password in DB
      await User.findByIdAndUpdate(id, { password: hashedPassword });
  
      res.send("Password Updated Successfully");
  
    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }
  });
  
  

  module.exports = profilerouter