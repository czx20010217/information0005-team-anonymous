const mongoose = require('mongoose') 
const schema = new mongoose.Schema({ 
    patient_id: { type: String, required: true, unique: true },
    engage_count: { type: Number, required: true }
}, {
    timestamps: true
}) 
const Engagement = mongoose.model('Engagement', schema) 
module.exports = Engagement