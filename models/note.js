const mongoose = require('mongoose') 

const schema = new mongoose.Schema({ 
    patient_id: { type: String, required: true}, 
    text: { type: String, required: true}
}, {
    timestamps: true
}) 
const Note = mongoose.model('Note', schema) 
module.exports = Note