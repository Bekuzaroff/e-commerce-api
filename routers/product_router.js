const router = require('express').Router();
const Auth_controller = require('../controllers/auth_controller');
const Product_controller = require('./../controllers/product_controller');

const controller = new Product_controller();
const auth = new Auth_controller();

router.route('')
    .get(auth.protect, controller.get_all_products)
//     .post()
//     .patch()
//     .delete()

module.exports = router;