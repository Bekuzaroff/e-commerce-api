const ApiError = require('../utils/api_error');
const Product = require('./../models/product');
const Helper = require('./../utils/helper');

class Product_controller{
    async get_all_products(req, res, next) {
        try{
            let products = await Product.find();

            Helper.sendResponse(res, 200, 'success', products);

        }catch(err){
            next(ApiError.internal(err.message));
        }
    }
    async add_product(req, res, next) {
          try{
            const product = await Product.create(req.body);

            Helper.sendResponse(res, 201, 'success', product);

          }catch(err){
            if(err.name == 'ValidationError'){
                //join all the error messages to show all of them
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
                return next(ApiError.badRequest(`product with id "${req.params.id}" does not exist`))
            }
            
            Helper.sendResponse(res, 200, 'success', "updated successfully");

        }catch(err){
            if(err.name === 'CastError'){
                return next(ApiError.badRequest('wrong id cast'));
            }
            return next(ApiError.internal(err.message));
        }
    }

    async delete_product(req, res, next) {
        try{
            const product = await Product.findByIdAndDelete(req.params.id);

            if(!product){
                return next(ApiError.badRequest(`product with id "${req.params.id}" does not exist`))
            }
            
            Helper.sendResponse(res, 200, 'success', "deleted successfully");

        }catch(err){
            if(err.name === 'CastError'){
                return next(ApiError.badRequest('wrong id cast'));
            }
            return next(ApiError.internal(err.message));
        }
    }
}
module.exports = Product_controller;