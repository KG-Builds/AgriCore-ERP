import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/User.model.js";

const verifyJWT = asyncHandler(async(req, res, next)=>{
    //fetch the token from cookies or header object
    const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "");

    //throw error if no token is availabe
    //user is not authenticated
    if (!accessToken) {
        throw new ApiError(403, "Unauthorized Access", false);
    }

    //cookie options configure
    const options = {
        httpOnly:true,
        secure:false
    }

    //verify the access token fetched from above
    const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, options, (Error)=>{throw new ApiError(500, "Invalid AT")}) 
    
    if (!decodedToken) {
        throw new ApiError(403, "Invalid User Token", false);
    }   

    //fetch the user details using the id in the decodedToken object
    const user = await User.findById(decodedToken._id)?.select("-password -refreshToken");

    if (!user) {
        throw new ApiError(403, "Invalid User Token", false);
    }

    //inject the user into the req object
    req.user = user;

    //exits the middleware
    next();
})

export {verifyJWT};