let mongoose = require('mongoose')

//user Schema
module.exports ={
    user :  new  mongoose.Schema({
        username : String,
        password : String,
        img :String,
        type : String,
        status : Boolean
    }),
    goods:  new  mongoose.Schema({
        username : String,
        goodsName : String,
        img : [],
        goodsContent : String,
        goodsPrice: Number,
        type : String,
        uploadTime:{type:String,default:new Date().toLocaleString()},
        status : {type:Boolean,default: false},
        isDel:{type:Boolean,default: false}

    }),
    orders:  new  mongoose.Schema({
        orders : String,
        username : String,
        goodsName : String,
        buyers : String,
        status : String
    })
}





