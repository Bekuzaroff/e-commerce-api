const User = require('./../models/user');
const jsonwebtoken = require('jsonwebtoken');
const util = require('util');
const ApiError = require('../utils/api_error');

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
        }catch(err){
            if(err.name == 'ValidationError'){
                const messages = Object.values(err.errors).map(val => val.message);
                return next(ApiError.badRequest(messages));
            }else if(err.name == 'MongoServerError'){
                return next(ApiError.badRequest('this user already exists'));
            }
        }
         
    }

    async sign_in(req, res, next) {
        try{
            const {email, password} = req.body;
        let user = await User.findOne({email});

        if(!user){;
            return next(ApiError.notFound('user with such email does not exist'));
        }
        if(!(await user.right_password(password, user.password))){
            return next(ApiError.badRequest('wrong password'));
        }

        let token = Auth_controller.sign_jwt(user._id);

        res.cookie('jwt', token, {
            maxAge: process.env.JWT_EXPIRES,
        });

        res.status(201).json({
            status: 'success',
            token
        })
        }catch(err){
            return next(ApiError.internal(err.message));
        }

    }
    async update_user_info(req, res, next) {
        try{
            let user = req.user;
            await User.updateOne({_id: user.id}, req.body);

            if(!user){
                return next(ApiError.notFound('you are not logged in'));
            }
            res.status(200).json({
                status: 'success',
                data: await User.findOne({_id: user.id})
            })
        }catch(err){
            return next(ApiError.internal(err.message));
        }
    }

    async deleteMe(req, res, next) {
        try{
            let user = req.user;

            if(!user){
                return next(ApiError.notFound('you are not logged in'));
            }

            await User.deleteOne({_id: user.id});

            res.status(200).json({
                status: 'success',
                message: 'deleted successfully'
            });
        }catch(err){
            return next(ApiError.internal(err.message));
        }
    }

    async protect(req, res, next){
        try{
            let jwt = await util.promisify(jsonwebtoken.verify)(req.headers.jwt, process.env.JWT_SECRET_KEY);

            const user = await User.findById(jwt.id);

            if(!user){
                return next(ApiError.badRequest('this user does not exist'));
            }
            if(await user.password_changed_after_jwt(jwt.iat)){ 
                return next(ApiError.badRequest('your password was changed recently after you logged in, please, login again'));
            }
            
            req.user = user;
            next();
        }catch(err){
            if(err.name == 'TokenExpiredError' || err.name == 'JsonWebTokenError'){
                return next(ApiError.badRequest(err.message));
            }
            return next(ApiError.internal(err.message));
        }
    }
}
module.exports = Auth_controller;