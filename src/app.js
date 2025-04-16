const express = require("express")
const app = express()
const connectDb = require("./Config/Database")
const User = require("./Models/User")
const {validSignUpData} = require("./utils/Validation")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser");
const {userAuth} = require("./Middlewares/auth")
app.use(cookieParser()); // ✅ This line parses cookies from requests

app.use(express.json())

const authrouter = require("./routes/auth")
const requestrouter = require("./routes/connections")
const profilerouter = require("./routes/profile")

app.use("/",authrouter)
app.use("/",requestrouter)
app.use("/",profilerouter)



connectDb().then(( )=>{
    console.log("Database connected")
    app.listen(7000,()=>{
        console.log("Successfully  running on port 7000")
    })
    }).catch(err=>{
        console.log("Not connected",err.message)
    })

