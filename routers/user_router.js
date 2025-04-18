const express = require('express');
const User_controller = require('./../controllers/user_controller');

const router = express.Router();
const user_controller = new User_controller();


//AUTH METHODS
router.route('/signup/:admin_token*?')
    .post(user_controller.sign_up);

router.route('/signin')
    .post(user_controller.sign_in);

// router.route('/forgot_password')
//     .post()

// router.route('/reset_password')
//     .patch()

router.route('/delete_me')
    .delete(user_controller.protect, user_controller.deleteMe);

router.route('/logout')
    .post(user_controller.protect, user_controller.log_out);

router.route('/update_details')
    .patch(user_controller.protect, user_controller.update_user_info);

router.route('/update_password')
    .patch(user_controller.protect, user_controller.update_password);

//logined
router.route('/cart')
    .patch(user_controller.protect, user_controller.add_product_to_cart)
    .delete(user_controller.protect, user_controller.delete_products_from_cart);

module.exports = router;