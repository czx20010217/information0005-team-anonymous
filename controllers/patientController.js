const Patient = require('../models/patient')
const Record = require('../models/record')

// add records
const insertRecord = (req,res) => {
    // hard code user for temporary usage
    console.log("adding new record, input param: ", req.body)

    const {
        blood_glucose_level, blood_glucose_level_commment, 
        weight, weight_commment, 
        doses_of_insulin_taken, doses_of_insulin_taken_commment, 
        exercise, exercise_commment} = req.body;

    patient_id = "625bd3b2263cf5c4c2442a16"
    submitted = true
    const newRecord = new Record({  patient_id, submitted, 
        blood_glucose_level, blood_glucose_level_commment, 
        weight, weight_commment, 
        doses_of_insulin_taken, doses_of_insulin_taken_commment, 
        exercise, exercise_commment});

    newRecord.save();
    // return the new Record after cleaningy
    res.render("recordSubmited")
}

const getDashBoard = (req,res) => {
    try { 
        return res.render('patientDashBoard')
    } catch (err) { 
        return next(err) 
    } 
}

const addDailyRecord = (req,res) => {
    try { 
        return res.render('addRecords')
    } catch (err) { 
        return next(err) 
    } 
}

module.exports = {
    insertRecord, 
    getDashBoard, 
    addDailyRecord, 
}