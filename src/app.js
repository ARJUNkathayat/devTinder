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




//for new user to add in db
app.post("/Signup", async (req, res) => {
  try {
    validSignUpData(req);

    const password = req.body.password;

    // 🔒 Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const { firstName, lastName, gender, about, email, country } = req.body;
    const data = new User({
      firstName,
      lastName,
      gender,
      about,
      email,
      country,
      password: hashedPassword
    });

    await data.save();
    res.send("User signed up successfully");
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(400).send("Signup failed");
  }
});

//to login the user


app.post("/Login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      throw new Error("No user found");
    }

    const isPasswordCorrect = await user.validatePassword(password);
    if (!isPasswordCorrect) {
      throw new Error("Invalid credentials");
    }

    const token = user.getjwt(); // You don't need await if not returning a Promise
    res.cookie("token", token);
    res.send("Login Successful");

  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});





app.get("/profile", userAuth, async (req, res) => {
  try {
    // ✅ Use user from middleware
    const user = req.user;
    res.send(`Token verified. You are logged in as ${user.firstName}`);
  } catch (err) {
    console.error("Profile error:", err.message);
    res.status(500).send("Server error");
  }
});


app.post("/sendConnectionRequest", userAuth ,async (req,res) => {
  const user = req.user
  console.log("Reques done")

res.send(user.firstName+"  Send the request ")
  
})
 




connectDb().then(( )=>{
    console.log("Database connected")
    app.listen(7000,()=>{
        console.log("Successfully  running on port 7000")
    })
    }).catch(err=>{
        console.log("Not connected",err.message)
    })

