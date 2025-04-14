const ApiError = require('../utils/api_error');
const Product = require('./../models/product');

class Product_controller{
    async get_all_products(req, res, next) {
        try{
            let products = await Product.find();

            res.status(200).json({
                status: 'success',
                data: products
            })
        }catch(err){
            next(ApiError.internal(err.message));
        }
    }
    async add_product(req, res, next) {
          try{
            const product = await Product.create(req.body);

            res.status(201).json({
                status: 'success',
                data: product
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

    async update_product(req, res, next) {
        try{
            const product = await Product.findByIdAndUpdate({_id: req.params.id}, req.body);

            if(!product){
                return next(ApiError.badRequest(`product with id "${req.query.id}" does not exist`))
            }
            
            res.status(200).json({
                status: 'success',
                message: 'update successfully'
            })

        }catch(err){
            if(err.name === 'CastError'){
                return next(ApiError.badRequest('wrong id cast'));
            }
            return next(ApiError.internal(err.message));
        }
    }

    async delete_product(req, res, next) {
        try{
            const product = await Product.findByIdAndDelete(req.query.id);

            if(!product){
                return next(ApiError.badRequest(`product with id "${req.query.id}" does not exist`))
            }
            
            res.status(200).json({
                status: 'success',
                message: 'deleted successfully'
            })

        }catch(err){
            if(err.name === 'CastError'){
                return next(ApiError.badRequest('wrong id cast'));
            }
            return next(ApiError.internal(err.message));
        }
    }
}
module.exports = Product_controller;