const express = require("express")
const app = express()

app.use("/admin",(req,res,next)=>{
     const token = "xyz"
      if(token == "xyz"){
        next();
    }else{
        res.status(401).send("Unauthorized access")
    }
     
})

app.use("/user",(req,res,next)=>{
   
        res.send("user welcome")
    
    
})


app.use("/admin/getData",(req,res,next)=>{
   
        res.send("data send")
    
    
})


app.use("/admin/deleteData",(req,res,next)=>{
  
        res.send("data deleted")
    
    
})


app.listen(7000,()=>{
    console.log("Successfully  running on port 7000")
})