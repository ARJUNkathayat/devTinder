const express = require("express")
const app = express()
const connectDb = require("./Config/Database")
const User = require("./Models/User")


app.post("/user",async (req,res)=>{

    const userData = {
        
        firstName:"Sachin",
        lastName:"Tendulkar",
        email:"tendulkarsachin@gmail.com",
        gender:"Male"
    
    }
    const user = new User(userData);
    try{
     await user.save()
     res.send("User  data is added Successfully ")
    }catch(err){
        res.status(400).send("Error saving the data")
    }
    


})



connectDb().then(( )=>{
    console.log("Database connected")
    app.listen(7000,()=>{
        console.log("Successfully  running on port 7000")
    })
    }).catch(err=>{
        console.log("Not connected")
    })

