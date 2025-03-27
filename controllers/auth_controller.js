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
            const err = new CustomError(e.message);
            next(err);
        }
        
            
    }

    async sign_in(req, res, next) {
        const {email, password} = req.body;
        let user = await User.findOne({email});

        if(!user){
            let err = new CustomError('user with such email does not exist');
            return next(err);
        }
        if(!(await user.right_password(password, user.password))){
            let err = new CustomError('wrong password');
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
            let user = req.user;
            await User.updateOne({_id: user.id}, req.body);

            if(!user){
                const err = new CustomError('you are not logged in');
                next(err);
            }
            res.status(200).json({
                status: 'success',
                data: await User.findOne({_id: user.id})
            })
        }catch(e){
            const err = new CustomError(e.message);
            next(err);
        }
    }

    async deleteMe(req, res, next) {
        try{
            let user = req.user;

            if(!user){
                let err = new CustomError('you are not logged in', 404);
                return next(err);
            }

            await User.deleteOne({_id: user.id});

            res.status(200).json({
                status: 'success',
                message: 'deleted successfully'
            });
        }catch(e){
            const err = new CustomError(e.message);
            next(err);
        }
    }

    async protect(req, res, next){
        try{
            let jwt = await util.promisify(jsonwebtoken.verify)(req.headers.jwt, process.env.JWT_SECRET_KEY);

            const user = await User.findById(jwt.id);

            if(!user){
                const err = new CustomError('this user does not exist', 404);
                next(err);
            }
            if(await user.password_changed_after_jwt(jwt.iat)){ 
                const err = new CustomError('your password was changed recently after you logged in, please, login again', 400);
                next(err);
            }
            

            req.user = user;
            next();
        }catch(e){
            const err = new CustomError(e.message);
            next(err);
        }
    }
}
module.exports = Auth_controller;