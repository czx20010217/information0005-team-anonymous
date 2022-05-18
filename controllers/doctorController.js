const Patient = require('../models/patient')
const Record = require('../models/record')
const Doctor = require('../models/doctor')
const Engagement = require('../models/engagement')

var stringify = require('json-stringify-safe');
const User = require('../models/user');

const getCurrentDoctor = async (req) => {
    const user_id = req.user._id
    const doctor = await Doctor.findOne({user_id: user_id}).lean()
    return doctor
}

const getAllPatientData = async (req, res, next) => {
    
    try { 
        // get curent logged in doctor
        const current_doctor = await getCurrentDoctor(req)

        var records = await Record.find().sort('-createdAt').lean()
        for (let i = 0; i < records.length; i++) {
            const patient = await Patient.findById(records[i].patient_id).lean()
            records[i].patient = patient
            // Change the format of createAt to YYYY/MM/DD
            records[i].createdAt = records[i].createdAt.toISOString().split('T')[0]
        }
        return res.render('doctorDashboard', { layout: false , data: records, doctor: current_doctor}) 
    } catch (err) { 
        return next(err) 
    }
} 

/*
    Find the patient infomation and their records by ID
*/
const getPatientById = async(req, res, next) => { 
    try { 
        const patient = await Patient.findById(req.params.patient_id).lean()
        const records = await Record.find({patient_id: req.params.patient_id}).sort('-createdAt').lean()
        if (!patient) { 
            // no patient found in database
            return res.sendStatus(404)
        }
        // found person 
        for (let i = 0; i < records.length; i++) {
            records[i].patient = patient
            // Change the format of createAt to YYYY/MM/DD
            records[i].createdAt = records[i].createdAt.toISOString().split('T')[0]
        }
        return res.render('onePatient', { patient: patient, recordList: records})
    } catch (err) { 
        return next(err) 
    } 
} 

const addPatientPage = async(req, res, next) => { 
    try { 
        return res.render('addNewPatient', { layout: false })
    } catch (err) { 
        return next(err) 
    } 
} 

const insertNewPatient = async(req, res, next) => { 
    try { 
        const doctor = await getCurrentDoctor(req)
        const {
            first_name, last_name, gender, 
            blood_glucose_level, weight, dose_of_insulin_taken, exercise, 
            blood_glucose_level_minimum, blood_glucose_level_maximum, weight_minimum, weight_maximum, 
            doses_of_insulin_taken_minimum, doses_of_insulin_taken_maximum, exercise_minimum, exercise_maximum, 
            username, password, secret} = req.body;

        const existingUser = await User.findOne({username: username}).lean()
        if (existingUser){
            return res.render('addNewPatient', { layout: false, repeat: true })
        }

        var need_blood_glucose_level = false, need_weight = false, need_doses_of_insulin_taken = false, need_exercise = false

        if (blood_glucose_level == "on"){
            var need_blood_glucose_level = true
        }
        if (weight == "on"){
            var need_weight = true
        }
        if (dose_of_insulin_taken == "on"){
            var need_doses_of_insulin_taken = true
        }
        if (exercise == "on"){
            var need_exercise = true
        }

        var user_type = 'patient'
        const newUser = new User({username, password, user_type, secret})
        const newPatient = new Patient({user_id: newUser._id, first_name, last_name, gender, doctor_id: doctor._id, 
            blood_glucose_level_minimum, blood_glucose_level_maximum, weight_minimum, weight_maximum, 
            doses_of_insulin_taken_minimum, doses_of_insulin_taken_maximum, exercise_minimum, exercise_maximum, 
            need_blood_glucose_level, need_weight, need_doses_of_insulin_taken, need_exercise})

        const newEngagement = new Engagement({patient_id: newPatient._id, engage_count: 0})
        newUser.save()
        newPatient.save()
        newEngagement.save()

        return res.render('registrationSuccessful', { layout: false })
    } catch (err) { 
        return next(err) 
    } 
} 

module.exports = {
    getAllPatientData,
    getPatientById, 
    addPatientPage, 
    insertNewPatient
} 