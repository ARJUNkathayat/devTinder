const validator = require("validator");
const validSignUpData = (req)=>{
    const {firstName,lastName,email,password} = req.body;
    if(!firstName || !lastName){
        throw new Error("Name is not valid")
    }else if(!validator.isEmail(email)){
        throw new Error("Email should be present")
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Enter a strong password")
    }
}
module.exports = {validSignUpData};