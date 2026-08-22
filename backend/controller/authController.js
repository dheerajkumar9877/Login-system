const db = require('../config/db')
const UserModels = require('../models/authModel');
const userModels = new UserModels();
class UserController{
    static async register(req,res){

        try{

            const {name , email ,password} = req.body ;
            if(!name ||!email||!password){
                return res.status(400).json({
                    message:"All feild required"
                });
            }

            await userModels.createUser(
                name ,
                email ,
                password
            )

            return res.status(200).json({
                message:"User Created Successfully"
            });

        }catch(err){
            console.log(err);
            return res.status(500).json({
                message:"Server error"
            })
        }
    }

    static async login (req,res) {
        try {
            const {email , password} = req.body ;

            if(!email || !password){
                return res.status(400).json({
                    message:"All feild required"
                })
            }

            const isLogin = await userModels.login(
                email ,
                password
            )

            if (!isLogin) {
                return res.status(401).json({
                    message: "Invalid Email or Password"
                });
            }
            
            return res.status(200).json({
                message:"Login Successfully"
            });

        }catch(err){
            console.log(err);
            return res.status(500).json({
                message: "Server Error"
            })
        }
    }
}

module.exports = UserController ;