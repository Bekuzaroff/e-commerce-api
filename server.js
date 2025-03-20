import app from './app.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({path: './main.env'});

mongoose.connect(process.env.DB_URL).then(value => {
    console.log('db connected');
}).catch((reason) => console.log(reason));


const PORT = 8000
app.listen(PORT, '127.0.0.1', () => {
    console.log('start server')
})