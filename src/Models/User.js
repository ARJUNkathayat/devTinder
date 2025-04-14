const mongoose = require("mongoose")
const Userschema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        
    },
    lastName:{
        type:String,
    },
    password:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    gender:{
        type:String,
    },
    about:{
        type:String,
        default:"This is default value of about You can change it."
    },
    Country:{
        type:String,
    }
},{
    timestamps:true
})



const User = mongoose.model("User",Userschema);

Userschema.methods.getjwt = async function () {
    const user = this

    const token =  await jwt.sign({id:user.id},"DevTinder@2005")
    return token
         
    
}
Userschema.methods.validatePassword = async function (passwordInputByUser) {
    return await bcrypt.compare(passwordInputByUser, this.password);
  };
  

module.exports=User;

