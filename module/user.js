let mongoose = require('mongoose'),
    userScheme = require('../Schema/user')

//user modul
module.exports = {
     user : mongoose.model('User',userScheme.user),
    goods : mongoose.model('Good',userScheme.goods),
    orders : mongoose.model('Order',userScheme.orders)
}





