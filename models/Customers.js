var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var customerSchema = new Schema({
    name: String,
    phoneNumber: Number
})

module.exports = mongoose.model('Customer', customerSchema)