const router = require('express').Router();
const Auth_controller = require('../controllers/auth_controller');
const Product_controller = require('./../controllers/product_controller');

const controller = new Product_controller();
const auth = new Auth_controller();

router.route('')
    .get(auth.protect, controller.get_all_products)
    .post(auth.protect, auth.isAdmin, controller.add_product)
    .patch(auth.protect, auth.isAdmin, controller.update_product)
//     .delete()

module.exports = router;