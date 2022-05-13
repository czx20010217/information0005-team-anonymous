const Patient = require('../models/patient')
const Record = require('../models/record')
const User = require('../models/user')

const getCurrentpatient = async (req) => {
    const user_id = req.user._id
    const patient = await Patient.findOne({user_id: user_id}).lean()
    return patient
}

// add records
const insertRecord = async (req,res) => {
    // get current user
    const patient = await getCurrentpatient(req)
    patient_id = patient._id

    // get current date
    var now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    // check and avoid same record for same patient in one day
    const record = await Record.findOne({patient_id: patient_id, updatedAt: {$gte: startOfToday}}).lean()
    if (record){
        res.render("recordSubmited", {layout: false})
        return
    }

    // create and save new record
    const {
        blood_glucose_level, blood_glucose_level_commment, 
        weight, weight_commment, 
        doses_of_insulin_taken, doses_of_insulin_taken_commment, 
        exercise, exercise_commment} = req.body;

    submitted = true
    const newRecord = new Record({ patient_id, submitted, 
        blood_glucose_level, blood_glucose_level_commment, 
        weight, weight_commment, 
        doses_of_insulin_taken, doses_of_insulin_taken_commment, 
        exercise, exercise_commment});

    newRecord.save();

    res.render("recordSubmited", {layout: false})
}

const getDashBoard = async (req,res) => {
    try {
        // get current logged in user
        const patient = await getCurrentpatient(req)

        return res.render('patientDashboard.hbs', {layout: false, patient: patient})
    } catch (err) { 
        return next(err) 
    } 
}

const addDailyRecord = async (req,res) => {
    try { 
        // get current date
        var now = new Date()
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())

        // get current logged in user
        const patient = await getCurrentpatient(req)

        // check and avoid same record for same patient in one day
        const record = await Record.findOne({patient_id: patient._id, updatedAt: {$gte: startOfToday}}).lean()
        if (record){
            res.render("recordAlreadySubmitted", {layout: false})
            return
        }
        return res.render('addRecords', {layout: false})
    } catch (err) { 
        return next(err) 
    } 
}

const myRecords = async (req,res) => {
    try { 
        return res.render('myrecords', {layout: false})
    } catch (err) { 
        return next(err) 
    } 
}

module.exports = {
    insertRecord, 
    getDashBoard, 
    addDailyRecord, 
    myRecords, 
}