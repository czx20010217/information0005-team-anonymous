const mongoose = require('mongoose') 
const schema = new mongoose.Schema({ 
    first_name: String, 
    last_name: String,

}) 
const Doctor = mongoose.model('Doctor', schema) 
module.exports = Doctor 