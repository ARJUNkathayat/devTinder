const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../Middlewares/auth");
const ConnectionRequestModel = require("../Models/connectionRequest");

// ✅ Get all pending connection requests sent *to* the logged-in user
userRouter.get("/user/request", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "Interested"
    }).populate("fromUserId", ["firstName", "lastName"]);

    res.json({
      message: "Pending connection requests",
      data: connectionRequests
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get all accepted connections of the logged-in user
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const acceptedConnections = await ConnectionRequestModel.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "Accepted" },
        { toUserId: loggedInUser._id, status: "Accepted" }
      ]
    }).populate("fromUserId", "firstName lastName")
      .populate("toUserId", "firstName lastName");

    const connections = acceptedConnections.map(connection => {
      // return the "other" user in the connection
      return connection.fromUserId._id.toString() === loggedInUser._id.toString()
        ? connection.toUserId
        : connection.fromUserId;
    });

    res.json({
      message: "All the accepted connections",
      data: connections
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = userRouter;
