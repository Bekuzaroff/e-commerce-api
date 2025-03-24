const mongoose = require('mongoose');

const product_schema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true,
        unique: true
    },
    colors: {
        type: Array,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true
    }
});

const Product = mongoose.model('product', product_schema);
module.exports = Product;