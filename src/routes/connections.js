const express = require("express")
const requestrouter = express.Router();
const User = require("../Models/User")
const mongoose = require("mongoose")

const {userAuth} = require("../Middlewares/auth")
const ConnectionRequests = require("../Models/connectionRequest")




requestrouter.post("/request/send/:status/:toUserId", userAuth ,async (req,res) => {

  try{

    const fromUserId = req.user._id
    const status = req.params.status
    const toUserId = req.params.toUserId
    const allowedStatus=["Ignored","Intrested"]
    if(!allowedStatus.includes(status)){
      return res.status(400).send("Please enter a valid status (Ignored or Interested)")
    }
    
if (!mongoose.Types.ObjectId.isValid(toUserId)) {
  return res.status(400).send("Invalid user ID format");
}

    const toUserPresnt = await User.findById(toUserId)
    if(!toUserPresnt){
      throw new Error("User not exist ")
    }
    if(toUserId==fromUserId){
      throw new Error("You can't Send request to yourself")
    }

    const alreadyPresent = await ConnectionRequests.findOne({
      $or:[
        {fromUserId,toUserId},
        {fromUserId:toUserId,toUserId:fromUserId}
      ]
    })
    if(alreadyPresent){
      throw new Error("Connection Request Already Exisit")
    }
    const newRequest = new ConnectionRequests({
      fromUserId,
      toUserId,
      status

    })
    const data = await newRequest.save();
    res.json({
      message:req.user.firstName+ status+toUser.firstName
      ,data
    })

  }catch(err){
    res.status(400).send("Error: " + err.message);
  }
 

  

  
})
module.exports = requestrouter