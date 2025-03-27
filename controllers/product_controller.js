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
}
module.exports = Product_controller;