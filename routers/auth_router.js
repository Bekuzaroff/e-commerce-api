const express = require('express');
const Auth_controller = require('./../controllers/auth_controller');

const router = express.Router();
const auth = new Auth_controller();

router.route('/signup')
    .post(auth.sign_up)

router.route('/signin')
    .post(auth.sign_in)

// router.route('/forgot_password')
//     .post()

// router.route('/reset_password')
//     .patch()

router.route('/delete_me')
    .delete(auth.deleteMe)

router.route('/update_detailes')
    .patch(auth.update_user_info)

module.exports = router;