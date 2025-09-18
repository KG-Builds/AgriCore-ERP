import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//defining user schema
const UserSchema = new mongoose.Schema({
    //all the fields are objects with some attributes
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        index:true,
    },
    fullName:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
        //TODO: add validation on password length
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
        //TODO: add validation to the email format
    },
    refreshToken:{
        type:String
    }
},{
    //provides the date and time as other fields
    timestamps:true
})


//password should be stored in hash format
//adding essential functions like password check

//pre is middleware that provides us a way to write functionlity before the data is stored in the database
//hashing the password everytime if it is modified or updated
UserSchema.pre('save', async function(next){
    if (!this.isModified("password")) {
        //if the password is not modified then skips the encrypting functionality
        next();
    }

    //brcypt is a library that is used for encrypting data
    //hashing the password
    this.password = await bcrypt.hash(this.password, 10)
    next();
})


//we can add our custom method to the schema using the default methods function
UserSchema.methods.comparePassword = async function(password){
    //return true if the entered passoword is same as what is stored in database
    return await bcrypt.compare(password, this.password);
}

//generates the access token 
UserSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        //payload 
        _id:this._id
    },
        //token secret
        process.env.ACCESS_TOKEN_SECRET,
        {
            //token expiry
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

//generates the access token 
UserSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        //payload 
        _id:this._id
    },
        //token secret
        process.env.REFRESH_TOKEN_SECRET,
        {
            //token expiry
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", UserSchema);