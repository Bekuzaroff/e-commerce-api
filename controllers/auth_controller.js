const User = require('./../models/user');
const jsonwebtoken = require('jsonwebtoken');
const util = require('util');
const CustomError = require('.././utils/custom_error');

class Auth_controller{
    static sign_jwt(id) {
        return jsonwebtoken.sign({id}, process.env.JWT_SECRET_KEY, {
            expiresIn: process.env.JWT_EXPIRES
        });
    }
    async sign_up(req, res, next) {
        try{
            let user = await User.create(req.body);
            let token = Auth_controller.sign_jwt(user._id);

            res.cookie('jwt', token, {
                maxAge: process.env.JWT_EXPIRES,
            });

            res.status(201).json({
                status: 'success',
                token
            })
        }catch(e){
            let msg = e.message;
            let statusCode = 400;

            if(msg.includes('user validation failed')){
                statusCode = 400;
            }else{
                statusCode = 500;
                msg = 'something went wrong';
            }

            const err = new CustomError(e.message, statusCode);
            next(err);
        }
        
            
    }

    async sign_in(req, res, next) {
        const {email, password} = req.body;
        let user = await User.findOne({email});

        if(!user){
            let err = new CustomError('user with such email does not exist', 404);
            return next(err);
        }
        if(!(await user.right_password(password, user.password))){
            let err = new CustomError('wrong password', 400);
            return next(err);
        }

        let token = Auth_controller.sign_jwt(user._id);

        res.cookie('jwt', token, {
            maxAge: process.env.JWT_EXPIRES,
        });

        res.status(201).json({
            status: 'success',
            token
        })

    }
    async update_user_info(req, res, next) {
        try{
            const token = await util.promisify(jsonwebtoken.verify)(req.headers.jwt, process.env.JWT_SECRET_KEY);
            const id = token.id;
    
            await User.updateOne({_id: id}, req.body);
    
            res.status(200).json({
                status: 'success',
                data: await User.findOne({_id: id})
            })
        }catch(e){
            const err = new CustomError(e.message, 400);
            next(err);
        }
    }

    async deleteMe(req, res, next) {
        try{
            let token = await util.promisify(jsonwebtoken.verify)(req.headers.jwt, process.env.JWT_SECRET_KEY);
            let id = token.id;

            let user = await User.findOne({_id: id});

            if(!user){
                let err = new CustomError('this user does not exist', 404);
                return next(err);
            }

            await User.deleteOne({_id: id});

            res.status(200).json({
                status: 'success',
                message: 'deleted successfully'
            });
        }catch(e){
            const err = new CustomError(e.message, 400);
            next(err);
        }
    }
}
module.exports = Auth_controller;