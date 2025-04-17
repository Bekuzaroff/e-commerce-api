const express = require('express');
const Auth_controller = require('./../controllers/auth_controller');

const router = express.Router();
const auth = new Auth_controller();

router.route('/signup/:admin_token*?')
    .post(auth.sign_up);

router.route('/signin')
    .post(auth.sign_in);

// router.route('/forgot_password')
//     .post()

// router.route('/reset_password')
//     .patch()

router.route('/delete_me')
    .delete(auth.protect, auth.deleteMe);

router.route('/logout')
    .post(auth.protect, auth.log_out);

router.route('/update_detailes')
    .patch(auth.protect, auth.update_user_info);

router.route('/update_password')
    .patch(auth.protect, auth.update_password);

//logined
router.route('/add_to_cart')
    .patch(auth.protect, auth.add_product_to_cart);

module.exports = router;