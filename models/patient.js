const mongoose = require('mongoose') 
const schema = new mongoose.Schema({ 
    user_id: { type: String, required: true, unique: true },
    first_name: String, 
    last_name: String, 
    gender: String, 
    doctor_id: String, 
    blood_glucose_level_minimum: {type: Number, default: 0}, 
    blood_glucose_level_maximum: {type: Number, default: 0}, 
    weight_minimum: {type: Number, default: 0}, 
    weight_maximum: {type: Number, default: 0}, 
    doses_of_insulin_taken_minimum: {type: Number, default: 0}, 
    doses_of_insulin_taken_maximum: {type: Number, default: 0}, 
    exercise_minimum: {type: Number, default: 0}, 
    exercise_maximum: {type: Number, default: 0}, 
    need_blood_glucose_level: { type: Boolean, required: true}, 
    need_weight: { type: Boolean, required: true}, 
    need_doses_of_insulin_taken: { type: Boolean, required: true}, 
    need_exercise: { type: Boolean, required: true}, 
}) 
const Patient = mongoose.model('Patient', schema) 
module.exports = Patient