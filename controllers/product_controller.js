const CustomError = require('../utils/custom_error');
const Product = require('./../models/product');

class Product_controller{
    async get_all_products(req, res, next) {
        try{
            let products = await Product.find();

            res.status(200).json({
                status: 'success',
                data: products
            })
        }catch(e){
            let err = new CustomError(e.message, 500);
            next(err);
        }
    }
}
module.exports = Product_controller;