import app from './app.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';


dotenv.config({path: './main.env'});

mongoose.connect(process.env.DB_URL).then((value) => {
    console.log('db is connected');
})

const PORT = 8000
app.listen(PORT, '127.0.0.1', () => {
    console.log('start server');
})