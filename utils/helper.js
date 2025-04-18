class Helper{
    static sendResponse(res, statusCode, status, data){
            res.status(statusCode).json({
                status,
                data
            });
    }
}

module.exports = Helper;