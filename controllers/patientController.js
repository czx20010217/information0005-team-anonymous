const Patient = require('../models/patient')
const Record = require('../models/record')

// add records
const insertRecord = async (req,res) => {
    // hard code user for temporary usage
    patient_id = "626b81faae8828ea7f3a9983"
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
    // get current logged in patient's info
    patient_id = "626b81faae8828ea7f3a9983"

    try { 
        const patient = await Patient.findById(patient_id).lean()
        return res.render('patientDashboard.hbs', {layout: false, patient: patient})
    } catch (err) { 
        return next(err) 
    } 
}

const addDailyRecord = async (req,res) => {
    patient_id = "626b81faae8828ea7f3a9983"
    
    try { 
        // get current date
        var now = new Date()
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())

        // check and avoid same record for same patient in one day
        const record = await Record.findOne({patient_id: patient_id, updatedAt: {$gte: startOfToday}}).lean()
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