const mongoose = require("mongoose")
const connectionRequestSchema = new mongoose.Schema({
        fromUserId:{
            type:mongoose.Schema.Types.ObjectId,
            required:true
        },
        toUserId:{
            type:mongoose.Schema.Types.ObjectId,
            required:true

        },
        status:{
            type:String,
            required:true,
            enum:{
                values:["ignores","Accepted","Rejected","Intrested"],
                message:"{value} is incorrect status type"
            }
        }


},{
    timestamps:true
});

connectionRequestSchema.pre("save", function(next){
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("You can't Send request to yourself")
    }
    next();
});
connectionRequestSchema.index({toUserId:1,fromUserId:1})
const ConnectionRequestModel = mongoose.model("ConnectionRequests",connectionRequestSchema)
module.exports = ConnectionRequestModel