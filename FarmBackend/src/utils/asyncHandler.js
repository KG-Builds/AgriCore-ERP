import { ApiError } from "./ApiError.js";

//wrapper async function with try and catch
//high order function
const asyncHandler = (func) => async(req,res,next) => {
    try {
        await func(req,res,next);
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message:error.message,
        })
    }
}

export default asyncHandler;