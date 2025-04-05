const express = require("express")
const app = express()
app.use("/hello",(req,res)=>{
    res.send("Konichiwa")
})
app.use("/Thanku",(req,res)=>{
    res.send("Arigato")
})
app.use((req,res)=>{
    res.send("Welcome to Server")
})
app.listen(7000,()=>{
    console.log("Successfully  running on port 7000")
})