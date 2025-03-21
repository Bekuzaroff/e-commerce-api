import express from 'express';
import Auth_controller from './../controllers/auth_controller.js';

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

// router.route('/delete_me')
//     .delete()

// router.route('update_detailes')
//     .put()

export default router;