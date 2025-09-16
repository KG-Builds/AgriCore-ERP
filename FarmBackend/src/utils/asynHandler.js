

const asyncHandler = (func) => async(req,res,next) => {
    try {
        await func(req,res,next);
    } catch (error) {
        console.log("Error ocuured in the function ");
        
    }
}

export default asyncHandler;