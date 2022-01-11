var db = require('../config/connection');
var collection = require('../config/collections');
var objectId=require('mongodb').ObjectId;
const bcrypt = require('bcrypt');
module.exports = {
    doSignup: (userData) => {
        return new Promise(async(resolve, reject) => {
            userData.password =await bcrypt.hash(userData.password, 10);
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data)=>{
                resolve(data.insertedId);
            })
        })
    },
    doLogin:(userData)=>{
        return new Promise(async (resolve,reject)=>{
            let loginStatus=false;
            let response = {};
            let user= await db.get().collection(collection.USER_COLLECTION).findOne({Email:userData.Email});
            if(user){
                bcrypt.compare(userData.password,user.password).then((status)=>{
                    if(status){
                        console.log('login success');
                        response.user=user;
                        response.status=true;
                        resolve(response);
                    }else{
                        console.log('login failed');
                        resolve({status: false});
                    }
                })
            }else{
                console.log('Login failed');
                resolve({status: false});
            }
        })
    },
    getAllUsers:()=>{
        return new Promise(async(resolve,reject)=>{
            let users =await db.get().collection(collection.USER_COLLECTION).find().toArray();
            resolve(users)
        })
    },
    deleteUser:(userId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION).deleteOne({_id:objectId(userId)}).then((response)=>{
                resolve(response)
            })
        })
    },
}