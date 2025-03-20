import User from "../models/user.js";

class Auth_controller{
    async sign_up(req, res, next) {
        try{
            let user = await User.insertOne(req.body);



            res.status(201).json({
                message: 'success',
            })
        }catch(e){
            res.status(400).json({
                message: e.message,
            })
        }
    }

    // sign_in(req, res) {
        
    // }
    
}
export default Auth_controller;