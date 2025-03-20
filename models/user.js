import mongoose from "mongoose";
import vaidator from 'validator';

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
        validate: [vaidator.isEmail, 'enter right email']
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

const User = mongoose.model('user', user_schema);

export default User;