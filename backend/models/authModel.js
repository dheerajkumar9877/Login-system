const bcrypt = require('bcrypt');
const db = require('../config/db')
class UserModels  {
    
    // Create User
    async createUser(name , email ,password ) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql ="INSERT INTO login(name , email , password) VALUES(?,?,?)";
        const values = [
            name ,
            email ,
            hashedPassword ,
        ]
        return new Promise((resolve, reject) => {
            db.query(sql,values,(err,result) => {
                if(err){
                    reject(err);
                    return;
                }
                console.log("Created Sussfully");
                resolve(result);
            });
        });
    }
    // login User
   async login(email, password) {
    const sql = "SELECT * FROM login WHERE email = ?";

    return new Promise((resolve, reject) => {
        db.query(sql, [email], async (err, result) => {

            if (err) {
                reject(err);
                return;
            }

            if (result.length === 0) {
                resolve(null);
                return;
            }

            const user = result[0];

            const match = await bcrypt.compare(
                password,
                user.password
            );

            if (!match) {
                resolve(null);
                return;
            }

            resolve({
                id: user.id,
                name: user.name,
                email: user.email
            });
        });
    });
}
   //forget
   async forget(email) {

        const sql = "SELECT * FROM Login WHERE email = ? "

        return new Promise((resolve,reject) =>{

            db.query(sql , [email] , (err,result) =>{

                if(err){
                    reject(err);
                    return;
                }

                if(result.length === 0){
                    resolve(null);
                    return;
                }
                const user = result[0] ;

                resolve(user);
            });
        });
   }
   //reset
   async resetPassword(email ,password){

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql ="UPDATE login SET password = ? WHERE email = ?"
        
        return new Promise((resolve , reject) =>{
            const values =[
            hashedPassword,
            email
        ]
            db.query(sql , values , (err ,result) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(result);
            })
        })
   }
}
module.exports = UserModels ;