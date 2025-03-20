import mongoose from "mongoose";
import vaidator from 'validator';
import bcrypt from 'bcrypt';

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
        select: false,
        type: String,
        required: [true, 'please confirm your password']
    }
});

//schema middlewares
user_schema.pre('save', async function(){
    this.password = await bcrypt.hash(this.password, 10);
    this.confirm_password = undefined;
})

const User = mongoose.model('user', user_schema);

export default User;