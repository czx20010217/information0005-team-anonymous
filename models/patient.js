const mongoose = require('mongoose') 
const schema = new mongoose.Schema({ 
    first_name: String, 
    last_name: String, 
    gender: String, 
    doctor_id: String, 
    blood_glucose_level_minimum: Number, 
    blood_glucose_level_maximum: Number, 
    weight_minimum: Number, 
    weight_maximum: Number, 
    doses_of_insulin_taken_minimum: Number, 
    doses_of_insulin_taken_maximum: Number, 
    exercise_minimum: Number, 
    exercise_maximum: Number, 
}) 
const Patient = mongoose.model('Patient', schema) 
module.exports = Patient