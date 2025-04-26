const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../Middlewares/auth");
const ConnectionRequestModel = require("../Models/connectionRequest");
const User = require("../Models/User");

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

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit>50?50:limit;
    const skip = (page -1 ) * limit;

    // 1. Get all connection requests involving the user
    const connectionRequests = await ConnectionRequestModel.find({
      $or: [
        { toUserId: loggedInUser._id },
        { fromUserId: loggedInUser._id }
      ]
    }).select("fromUserId toUserId");

    // 2. Create a set of userIds to hide from feed
    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    // Also hide the logged-in user
    hideUsersFromFeed.add(loggedInUser._id.toString());

    // 3. Fetch users who are not in hideUsersFromFeed
    const suggestedUsers = await User.find({
      _id: { $nin: Array.from(hideUsersFromFeed) }
    }).select("firstName lastName gender about").skip(skip).limit(limit);

    res.json({
      message: "Suggested users for your feed",
      data: suggestedUsers
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = userRouter;
