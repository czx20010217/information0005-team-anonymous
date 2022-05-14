const { type } = require('express/lib/response')
const mongoose = require('mongoose') 

const schema = new mongoose.Schema({ 
    patient_id: { type: String, required: true}, 
    doctor_id: { type: String, required: true}, 
    text: { type: String, required: true}
}, {
    timestamps: true
}) 
const Message = mongoose.model('Message', schema) 
module.exports = Message 