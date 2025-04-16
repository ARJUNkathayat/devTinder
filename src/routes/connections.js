const express = require("express")
const requestrouter = express.Router();

const {userAuth} = require("../Middlewares/auth")




requestrouter.post("/sendConnectionRequest", userAuth ,async (req,res) => {
  const user = req.user
  console.log("Reques done")

res.send(user.firstName+"  Send the request ")
  
})
module.exports = requestrouter