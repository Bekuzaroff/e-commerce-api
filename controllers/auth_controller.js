import User from "../models/user.js";
import jsonwebtoken from 'jsonwebtoken';
class Auth_controller{
    static sign_jwt(id){
        return jsonwebtoken.sign({id: id}, process.env.JWT_SECRET_KEY, {
            expiresIn: process.env.JWT_EXPIRES
        });
    }
    async sign_up(req, res, next) {
        try{
            let user = await User.create(req.body);
            let token = Auth_controller.sign_jwt(user._id);
            
            res.status(201).json({
                status: 'success',
                token
            })
        }catch(e){
            res.status(400).json({
                status: 'fail',
                message: e.message,
            })
        }
    }

    async sign_in(req, res, next) {
        const {email, password} = req.body;
        let user = await User.findOne({email});

        if(!(await user.right_password(password, user.password))){
            res.status(400).json({
                status: 'fail',
                message: 'wrong password'
            })
            return next();
        }

        let token = Auth_controller.sign_jwt(user._id);

        res.status(201).json({
            message: 'success',
            token
        })

    }
    
}
export default Auth_controller;