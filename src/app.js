const express = require("express")
const app = express()
app.get("/user/:name/:pwd",(req,res)=>{
    console.log(req.params)
    res.send({fname:"Arjun",
        lname:"Kathayat"
    })
})

app.get(/^\/ab+cd$/, (req, res) => {
    res.send("ok");
  });
  

app.delete("/user",(req,res)=>{
    res.send("Delete data successfully")
})
app.use("/hello",(req,res)=>{
    res.send("Konichiwa")
})




app.listen(7000,()=>{
    console.log("Successfully  running on port 7000")
})