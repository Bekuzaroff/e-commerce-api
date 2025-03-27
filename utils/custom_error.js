class CustomError extends Error{
    constructor(message, statusCode){
        super();
        this.message = message;
    }
}

module.exports = CustomError;