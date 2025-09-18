import asyncHandler from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import{ User} from "../models/User.model.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { options } from "../constants.js"
import jwt from "jsonwebtoken";

//this function generate necessary token for authentication
//updates the user database with the new refresh token value
const generateAccessNrefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    //gerating the token using the methdods defined in the userSchema
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    //updating the user refresh token field locally
    user.refreshToken = refreshToken;
    //reflecting the locally update to the database
    await user.save({ validateBeforeSave: false }, user);

    //returning the token to the function it was called
    return { refreshToken, accessToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while aunthenticating user. ",
      false
    );
  }
};

//this function register the first time user 
//fetch the user form data from the req body and creates a new user in the database
const registerUser = asyncHandler(async(req, res)=>{
  
    //fetching the form data from the req body
    const{username, email, password, fullName} = req.body;

    
    //validating if any of the fields are empty
    //some method return true or false with a condition defined 
     if ([email, username, password, fullName].some((field) => field?.trim === "")) {
        //custom error
        throw new ApiError(400, "All fields are required", false);
  }


  //checks if the user exsists already in the database
  //username and email fields are use for searching in the user collection
    const userExsits = await User.findOne({
        $or:[{username}, {email}]
    })

    //if user already exists then throw the custom error
    if (userExsits) {
        throw new ApiError(409, "User already exists", false)
    }

    //creating a new user in the user  collection
    const newUser = await User.create({
        //all the necessary fields of a user
        username:username?.toLowerCase(), 
        email,
        password,
        fullName
    })
    //it return the mongoose object as the return value

    //throw custom error if User is not created
    if (!newUser) {
        throw new ApiError(500, "Something went wrong while creating User", false)
    }

    //convertin the mongoose object to the normal object
    const response = newUser?.toObject();

    //removing the secret or confidentials field from the response object
    delete response.password
    delete response.refreshToken

    
    //returning the response object to res 
    return res.status(200)
    //custom repsonse is sent as the overall response
    .json(new ApiResponse(true, 200, response))

})

//provides the login feature
//checks for the user in the database and compare the password for authentication
const loginUser = asyncHandler(async(req, res)=>{
    //fetch the user details
    //deconstruction the req.body fields
    const {username, password} = req.body;

    //validating the user data fields
    if (!username || !password) {
        //custom error
        throw new ApiError(400, "All fields are required", false);
    }

    //check if the user exists in the database in the first place
     const userExists = await User.findOne({
        $or:[{username}]
    })

    if (!userExists) {
        throw new ApiError(404, "User doesnot exists ", false)
    }

    //user exists then compare the password
    const validPass = userExists.comparePassword(password);

    if (!validPass) {
        throw new ApiError(400, "Password is not correct ", false)
    }

    console.log(userExists._id);
    

    //if password is true then generate the refresh and access tokens
    const{accessToken , refreshToken} = await generateAccessNrefreshToken(userExists._id);

    
    if (!refreshToken || !accessToken) {
        //custom error
        throw new ApiError(500, "Failed token generation", false);
    }

    //fetching the updated user details
    const updatedUser = await User.findById(userExists);


    //options configured for the cookies 
    const options = {
        httpOnly:true, 
        secure:false, //works only on http request
    }

    return res.status(200)
    //setting cookies
    //tokens are stored in the user browser cookies
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse("User log in successfull", 200, updatedUser)) //sending the custom Api response
})

const logOutUser = asyncHandler(async(req, res)=>{
    const user = req?.user;

    //logout user -> delete the refresh token from the user collection

    //find the user from the user id provided from the user inject to res object
    //returns the update user
    const updatedUser = User.findByIdAndUpdate(req?.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        },
        {
            new:true
        }
    )

    return res.status(200)
    .clearCookie("accessToken", options) //clear cookies for successfull log out
    .clearCookie("refreshToken", options)
    .json(new ApiResponse("User logged out successfully", 200, user))

})


//updates the old user password
const updateUserPassword = asyncHandler(async(req, res)=>{

    //fetch both old and new Password
    const {newPassword, oldPassword} = req.body;

    //throw error if any of then are empty
    if (!newPassword || !oldPassword) {
        throw new ApiError(403, "All fields are necessary", false)
    }

    //fetch the user using the user id
    const user = await User.findById(req?.user._id);

    //compare if the password old password is correct
    const validPassword = user.comparePassword(oldPassword);

    if (!validPassword) {
        throw new ApiError(400, "Password is incorrect", false)
    }

    //update the password field with new passoword
    user.password = password
    //saves the changes made
    user.save({validateBeforeSave:false}, user);

    //return the response
    return res.status(200)
    .json(new ApiResponse("Password Changed successfully", 200))

})

const reGenerateTokens = asyncHandler(async(req, res)=>{
    //refresh token verification
    //not valid then routes -> login page
    //otherwise generate new tokens

    //refresh token from cookies
    const token = req.cookies.refreshToken;

    if (!refreshToken) {
        throw new ApiError(401, "Unauthorized access", false);
        //route -> login page
    }

    //refresh token verification
    const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET , (Error)=>{throw new ApiError(403, Error.message, false)})

    const user = User.findById(decodedToken?._id);

    if (!user) {
        throw new ApiError(409, "Invalid token", false);
    }

    //generate new tokens
    const {refreshToken, accessToken} = generateAccessNrefreshToken(user._id);

    return res.status(200)
    .cookie("refreshToken", refreshToken, options) //set new tokens to cookies
    .cookie("accessToken", accessToken, options)
    .json(new ApiResponse("Access Token generated successfully", 200))


})

export {
    registerUser,
    loginUser,
    logOutUser,
    updateUserPassword,
    reGenerateTokens
}