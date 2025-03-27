const express = require('express');
const limiter = require('express-rate-limit');
const hpp = require('hpp');
const helmet = require('helmet');
const sanitizer = require('express-mongo-sanitize');
const xss = require('xss-clean');

const auth_router = require('./routers/auth_router');
const product_router = require('./routers/product_router')
const app = express();

let error_handle = (err, req, res, next) => {
    let status = 'fail';
    let fields = ['user_name', 'email', 'password'];

    let statusCode = 400;;
    let msg = err.message;
    
    if(msg.includes('validation')){
        

        let k = 0;

        while(k != fields.length){

            if(!msg.includes(fields[k])){
                fields.splice(k, 1);
                continue;
            }

            k += 1;
        }

        if(msg.includes('your passwords do not match')){
            msg = 'your passwords do not match';
        }else{
            msg = `wrong ${fields}`;
        }

    }else if(msg.includes('duplicate key error')){
        msg = 'this user already exists, please, login';
    }
    res.status(statusCode).json({
        status: status,
        message: msg
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
app.use(sanitizer());
app.use(xss());

app.use(express.json({limit: '10kb'}));


app.use('/api/v1/auth', auth_router);
app.use('/api/v1/products', product_router);

app.use(error_handle);

app.use(express.static('./images'))

module.exports = app;




