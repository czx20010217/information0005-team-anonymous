const mongoose = require('mongoose') 
const schema = new mongoose.Schema({ 
    first_name: String, 
    last_name: String 
}) 
const Author = mongoose.model('Author', schema) 
module.exports = Author 