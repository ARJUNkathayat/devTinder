const express = require("express");
const requestrouter = express.Router();
const User = require("../Models/User");
const mongoose = require("mongoose");
const { userAuth } = require("../Middlewares/auth");
const ConnectionRequests = require("../Models/connectionRequest");

// -------------------- SEND CONNECTION REQUEST --------------------
requestrouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const status = req.params.status;
    const toUserId = req.params.toUserId;

    const allowedStatus = ["Ignored", "Interested"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).send("Please enter a valid status (Ignored or Interested)");
    }

    if (!mongoose.Types.ObjectId.isValid(toUserId)) {
      return res.status(400).send("Invalid user ID format");
    }

    const toUserPresnt = await User.findById(toUserId);
    if (!toUserPresnt) {
      throw new Error("User not exist");
    }

    if (toUserId.toString() === fromUserId.toString()) {
      throw new Error("You can't send a request to yourself");
    }

    const alreadyPresent = await ConnectionRequests.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId }
      ]
    });

    if (alreadyPresent) {
      throw new Error("Connection Request Already Exists");
    }

    const newRequest = new ConnectionRequests({
      fromUserId,
      toUserId,
      status
    });

    const data = await newRequest.save();

    res.json({
      message: `${req.user.firstName} ${status} ${toUserPresnt.firstName}`,
      data
    });

  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

// -------------------- REVIEW CONNECTION REQUEST --------------------
requestrouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { status, requestId } = req.params;

    const allowedStatus = ["Accepted", "Rejected"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).send("Please enter a valid status (Accepted or Rejected)");
    }

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).send("Invalid request ID format");
    }

    const connectionRequest = await ConnectionRequests.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "Interested"
    });

    if (!connectionRequest) {
      return res.status(400).json({
        message: "Connection request not found or already reviewed"
      });
    }

    connectionRequest.status = status;
    const data = await connectionRequest.save();

    res.json({
      message: "Connection request " + status,
      data
    });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = requestrouter;
