const mongoose = require("mongoose")

const connectDb = async()=>{
    await 
    mongoose.connect("mongodb+srv://ARJUN:11223344@namastenode.3btx4j4.mongodb.net/devTinder")
}
module.exports = connectDb;
