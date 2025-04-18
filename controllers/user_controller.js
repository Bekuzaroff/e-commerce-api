const User = require('../models/user');
const jsonwebtoken = require('jsonwebtoken');
const Product = require('../models/product');

const util = require('util');
const validator = require('validator');

const ApiError = require('../utils/api_error');


class User_controller{
    static sign_jwt(id) {
        return jsonwebtoken.sign({id}, process.env.JWT_SECRET_KEY, {
            expiresIn: process.env.JWT_EXPIRES
        });
    }
    async sign_up(req, res, next) {
        try{
            req.body.role = 'user';
            req.body.cart = [];

            if(req.params.admin_token){
                if(req.params.admin_token === process.env.ADMIN_TOKEN){
                    req.body.role = 'admin';
                }else{
                    return next(ApiError.badRequest("admin token is wrong"));
                }
            }
            
            let user = await User.create(req.body);
            let token = User_controller.sign_jwt(user._id);

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

        let token = User_controller.sign_jwt(user._id);

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
            let non_existing_field = null;
            const fields = ["user_name", "email", "password"];
            
            Object.keys(req.body).forEach((val) => {
                if(!fields.includes(val)){
                    non_existing_field = val;
                }
            });

            if(non_existing_field){
                return next(ApiError.badRequest(`non existing field: ${non_existing_field}`))
            }
            
            if(req.body.password){
                return next(ApiError.badRequest('to change your password, use path: "/update_password" '))
            }
            if(req.body.email){
                if(!validator.isEmail(req.body.email)){
                    return next(ApiError.badRequest('wrong email'));
                }
            }

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

    async update_password(req, res, next) {
        try{
            const user = req.user;

            let old_pass = req.body.old_password;
            let new_pass = req.body.new_password;
            let confirm_new_pass = req.body.confirm_password;
            let non_existing_field = null;

            Object.keys(req.body).forEach((val) => {
                if(!fields.includes(val)){
                    non_existing_field = val;
                }
            });

            if(non_existing_field){
                return next(ApiError.badRequest(`non existing field: ${non_existing_field}`))
            }

            if(!await(user.right_password(old_pass, user.password))){
                return next(ApiError.badRequest('wrong actual password'));
            }

            if(new_pass !== confirm_new_pass){
                return next(ApiError.badRequest('your passwords do not match'));
            }

            user.password = new_pass;
            user.save();

            res.status(200).json({
                status: 'success',
                data: await User.findOne({_id: user.id})
            })
            
        }catch(err){
            if(err.name == 'TokenExpiredError' || err.name == 'JsonWebTokenError'){
                return next(ApiError.badRequest(err.message));
            }
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

    async log_out(req, res, next) {
        try{
            const user = req.user;

            if(!user){
                return next(ApiError.notFound('you are not logged in'));
            }

            user.password_changed_at = Date.now();
            user.save();

            res.status(200).json({
                status: 'success',
                message: 'logged out successfully'
            });
        }catch(err){
            return next(ApiError.internal(err.message));
        }
    }

    async protect(req, res, next) {
        try{
            let jwt = await util.promisify(jsonwebtoken.verify)(req.headers.jwt, process.env.JWT_SECRET_KEY);

            const user = await User.findById(jwt.id);

            if(!user){
                return next(ApiError.badRequest('this user does not exist'));
            }
            if(await user.password_changed_after_jwt(jwt.iat)){ 
                return next(ApiError.badRequest('you are logged out or changed password after you logged in, please, login again'));
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

    async isAdmin(req, res, next) {
        try{
            let user = req.user;

            if(user.role === 'admin'){
                return next();
            }

            throw ApiError.badRequest('you are not allowed to add/update/delete products');
        }catch(err){
            return next(err);
        }
    }

    async add_product_to_cart(req, res, next){
        try{
            let user = req.user;

            if(user.role !== 'user'){
                return next(ApiError.badRequest('E-Shop admins can not add products to carts'));
            }

            let product = await Product.findById(req.body._id);

            if(!product){
                return next(ApiError.badRequest('this product does not exist'));
            }

            const product_already_exists = user.cart.find((value) => {
                return value._id == req.body._id;
            });

            if(product_already_exists){
                return next(ApiError.badRequest('this product is already in your cart'));
            }

            user.cart.push(product);
            user.save();

            res.status(200).json({
                status: 'success',
                message: 'added to cart successfully'
            })

        }catch(e){
            return next(ApiError.internal(e.message));
        }
    }

    async delete_products_from_cart(req, res, next){
        const cart = req.user.cart;
        const products = req.body; /* array with objects to delete:
            [
            {_id: "67e1485e8dfe1d6320d586d9"},
            {_id: "67e1485e8dfe1d6320d586d9"},
            {_id: "67e1485e8dfe1d6320d586d9"}
            ]
         */
        let k = 0;

        while(k !== products.length){
            for(let i = 0; i < cart.length; i++){
                if(cart[i]._id != products[k]._id){
                    continue;
                }

                cart.splice(i, 1);
            }
            k++;
        }

        req.user.save();

        res.status(200).json({
            status: 'success',
            message: 'deleted from cart successfully'
        });
    }

    
}
module.exports = User_controller;