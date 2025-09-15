
class ApiError extends Error{

    constructor(statusCode, message="Something went wrong", success, stack, errors=[]){
        super(message);
        this.statusCode = statusCode,
        this.message = message,
        this.success= false,
        this.data = null,
        this.statusCode = statusCode,
        this.errors = errors
    }
}

export {ApiError};