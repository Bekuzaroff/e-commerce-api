const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const user_schema = mongoose.Schema({
    user_name: {
        type: String,
        unique: true,
        required: [true, 'please enter user name'],
        minlength: 5
    },
    email: {
        type: String,
        required: [true, 'please enter your email'],
        unique: true,
        validate: [validator.isEmail, 'enter right email']
    },
    password: {
        type: String,
        required: [true, 'please enter your password'],
        minlength: 6
    },
    confirm_password: {
        select: false,
        type: String,
        required: [true, 'please confirm your password'],
        validate: {
            validator: function(value){
                return value == this.password;
            },
            message: 'your passwords do not match'
        }
    },
    password_changed_at: Date,
    role: {
        type: String,
        enum: ['admin', 'user'],
        required: true
    },
    cart: {
        type: [Object],
        required: true
    }
});

user_schema.methods.right_password = async function(pass, db_pass){
    return await bcrypt.compare(pass, db_pass);
}
user_schema.methods.password_changed_after_jwt = async function (jwt_exp) {
    if(!this.password_changed_at) return false
    return parseInt(this.password_changed_at.getTime() / 1000, 10) > jwt_exp;
}
//schema middlewares

user_schema.pre('save', async function(){
    this.password = await bcrypt.hash(this.password, 10);
    this.confirm_password = undefined;
});

const User = mongoose.model('user', user_schema);

module.exports = User;