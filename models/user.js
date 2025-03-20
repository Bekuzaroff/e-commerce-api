import mongoose from "mongoose";
import { ExpressValidator } from "express-validator";

const user_schema = mongoose.Schema({
    user_name: {
        type: String,
        unique: true,
        required: [true, 'please enter user name']
    },
    email: {
        type: String,
        required: [true, 'please enter your email'],
        unique: true,
        validate: [ExpressValidator.isEmail, 'enter right email']
    },
    password: {
        type: String,
        required: [true, 'please enter your password'],
        minlength: 6
    },
    confirm_password: {
        type: String,
        required: [true, 'please confirm your password']
    }
});

const User = mongoose.model('users', user_schema);

export default User;