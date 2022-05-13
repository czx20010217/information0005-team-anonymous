const mongoose = require('mongoose') 
const schema = new mongoose.Schema({ 
    user_id: { type: String, required: true, unique: true },
    first_name: String, 
    last_name: String,

}) 
const Doctor = mongoose.model('Doctor', schema) 
module.exports = Doctor 