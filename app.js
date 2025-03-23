const express = require('express');
const router = require('./routers/auth_router');
const limiter = require('express-rate-limit');
const hpp = require('hpp');
const helmet = require('helmet');

const app = express();

let error_handle = (err, req, res, next) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
    next();
}

//security
app.use(helmet());
app.use(limiter({
    max: 3,
    windowMs: 60 * 60 * 1000,
    message: 'too many calls from this ip address, try again later'
}));
app.use(hpp());

app.use(express.json({limit: '10kb'}));


app.use('/api/v1/auth', router);
app.use(error_handle);

module.exports = app;




