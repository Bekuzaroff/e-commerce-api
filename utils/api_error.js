class ApiError extends Error{
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode;
        this.status = this.statusCode >= 400 && this.statusCode < 500 ? 'fail' : 'error'
        Error.captureStackTrace(this, this.constructor);
    }

    static badRequest(message = 'Bad request'){
        return new ApiError(message, 400);
    }

    static unauthorized(message = 'Unauthorized'){
        return new ApiError(message, 401);
    }

    static forbidden(message = 'Forbidden'){
        return new ApiError(message, 403);
    }

    static notFound(message = 'Not Found'){
        return new ApiError(message, 404);
    }

    static internal(message = 'Internal Server Error'){
        return new ApiError(message, 500);
    }
}

module.exports = ApiError;