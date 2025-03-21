const express = require('express');
const router = require('./routers/auth_router');

const app = express();

let error_handle = (err, req, res, next) => {
    console.log(err);
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
    next();
}

app.use(express.json());
app.use('/api/v1/auth', router);
app.use(error_handle);

module.exports = app;




