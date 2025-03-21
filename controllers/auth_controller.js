const User = require('./../models/user');
const jsonwebtoken = require('jsonwebtoken');
const util = require('util');

class Auth_controller{
    static sign_jwt(id){
        return jsonwebtoken.sign({id: id}, process.env.JWT_SECRET_KEY, {
            expiresIn: process.env.JWT_EXPIRES
        });
    }
    async sign_up(req, res, next) {
        try{
            let user = await User.create(req.body);
            let token = Auth_controller.sign_jwt(user._id);
            
            res.status(201).json({
                status: 'success',
                token
            })
        }catch(e){
            res.status(400).json({
                status: 'fail',
                message: e.message,
            })
        }
    }

    async sign_in(req, res, next) {
        const {email, password} = req.body;
        let user = await User.findOne({email});

        if(!(await user.right_password(password, user.password))){
            res.status(400).json({
                status: 'fail',
                message: 'wrong password'
            })
            return next();
        }

        let token = Auth_controller.sign_jwt(user._id);

        res.status(201).json({
            status: 'success',
            token
        })

    }
    async update_user_info(req, res, next){
        const token = await util.promisify(jsonwebtoken.verify)(req.headers.jwt, process.env.JWT_SECRET_KEY);
        const id = token.id;

        let user = await User.findByIdAndUpdate(id, req.body);

        res.status(200).json({
            status: 'success',
            data: req.body
        })


        
    }
    
}
module.exports = Auth_controller;