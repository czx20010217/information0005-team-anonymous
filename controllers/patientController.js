const Patient = require('../models/patient')
const Record = require('../models/record')

// add records
const insertRecord = (req,res) => {
    console.log("adding new record, input param: ", req.body)
    const {patient_id, 
        blood_glucose_level, blood_glucose_level_commment, 
        weight, weight_commment, 
        doses_of_insulin_taken, doses_of_insulin_taken_commment, 
        exercise, exercise_commment, 
        submitted } = req.body;


    const newRecord = new Record({patient_id, 
        blood_glucose_level, blood_glucose_level_commment, 
        weight, weight_commment, 
        doses_of_insulin_taken, doses_of_insulin_taken_commment, 
        exercise, exercise_commment, 
        submitted });
    newRecord.save();
    // return the new Record after cleaning
    res.send(newRecord)
}

module.exports = {
    insertRecord, 
}