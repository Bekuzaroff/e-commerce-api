const router = require('express').Router();
const User_controller = require('../controllers/user_controller');
const Product_controller = require('./../controllers/product_controller');

const product_controller = new Product_controller();
const user_controller = new User_controller();

router.route('/:id?')
    .get(user_controller.protect, product_controller.get_all_products)
    .post(user_controller.protect, user_controller.isAdmin, product_controller.add_product)
    .patch(user_controller.protect, user_controller.isAdmin, product_controller.update_product)
    .delete(user_controller.protect, user_controller.isAdmin, product_controller.delete_product);

module.exports = router;