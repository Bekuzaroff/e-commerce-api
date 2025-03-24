const express = require('express');
const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const app = express();


dotenv.config({path: './main.env'});

mongoose.connect(process.env.DB_URL).then(value => {
    console.log('db is connected');
}).catch((reason) => console.log(reason));

const PORT = 8000
app.listen(PORT, '127.0.0.1', () => {
    console.log('start server')
});