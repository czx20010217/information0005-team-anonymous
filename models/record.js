const mongoose = require('mongoose') 
const schema = new mongoose.Schema({ 
    patient_id: String, 
    blood_glucose_level: Number, 
    blood_glucose_level_commment: String, 
    weight: Number, 
    weight_commment: String, 
    doses_of_insulin_taken: Number, 
    doses_of_insulin_taken_commment: String, 
    exercise: Number, 
    exercise_commment: String, 
    submitted: Boolean
}) 
const Record = mongoose.model('Record', schema) 
module.exports = Record 