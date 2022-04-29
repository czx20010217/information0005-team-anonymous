const Patient = require('../models/patient')
const Record = require('../models/record')

// add records
const insertRecord = async (req,res) => {
    // hard code user for temporary usage
    patient_id = "626b81faae8828ea7f3a9983"
    // get current date
    var now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    // console.log(startOfToday)
    // console.log("adding new record, input param: ", req.body)
    const record = await Record.findOne({patient_id: patient_id, updatedAt: {$gte: startOfToday}}).lean()
    if (record){
        res.render("recordSubmited", {layout: false})
        return
    }
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
    // return the new Record after cleaningy
    res.render("recordSubmited", {layout: false})
}

const getDashBoard = async (req,res) => {
    patient_id = "626b81faae8828ea7f3a9983"
    const patient = await Patient.findById(patient_id).lean()

    try { 
        return res.render('patientDashboard.hbs', {layout: false, patient: patient})
    } catch (err) { 
        return next(err) 
    } 
}

const addDailyRecord = async (req,res) => {
    // hard code patient id
    patient_id = "626b81faae8828ea7f3a9983"
    var now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    const record = await Record.findOne({patient_id: patient_id, updatedAt: {$gte: startOfToday}}).lean()
    if (record){
        res.render("recordSubmited", {layout: false})
        return
    }
    try { 
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