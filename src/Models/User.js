const mongoose = require("mongoose")
const Userschema = new mongoose.Schema({
    firstName:{
        type:String,
    },
    LastName:{
        type:String,
    },
    email:{
        type:String,
    },
    gender:{
        type:String,
    }
})
const User = mongoose.model("User",Userschema);
module.exports=User;