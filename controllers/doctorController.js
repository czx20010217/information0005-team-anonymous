const Patient = require('../models/patient')
const Record = require('../models/record')
const Doctor = require('../models/doctor')
const Message = require('../models/message')


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
    Find the patient infomation and their records by ID (show with table)
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

/*
    Find the patient infomation and their records by ID (show chart instead of table)
*/
const getPatientChartById = async(req, res, next) => { 
    try { 
        const patient = await Patient.findById(req.params.patient_id).lean()
        const records = await Record.find({patient_id: req.params.patient_id}).sort('-createdAt').lean()

        var recordList = new Array();
        if (!patient) { 
            // no patient found in database
            return res.sendStatus(404)
        }
        // only show data of 7 records
        for (let i = 0; i < 7; i++) {
            var row = [records[i].createdAt.toISOString().split('T')[0], records[i].weight];
            recordList.push(row);
        }
        return res.render('chartview', {patient: patient, recordList: recordList})
    } catch (err) { 
        return next(err) 
    } 
}

const getPatientMessages = async(req, res, next) => {
    try {
        const patient = await Patient.findById(req.params.patient_id).lean()
        var messages = await Message.find({patient_id: patient._id}).lean()

        for (let i = 0; i < messages.length; i++) {
            // Change the format of createAt to YYYY-MM-DD
            messages[i].createdAt = messages[i].createdAt.toISOString().split('T')[0].replaceAll('-', '/')
        }

        return res.render('DoctorSupportMessage', {layout: false, patient: patient, messages: messages})
    } catch (err) { 
        return next(err) 
    }
}

const getComments  = async(req, res, next) => {
    try { 
        var records = await Record.find().sort('-createdAt').lean()
        let comments = new Array()

        for (let i = 0; i < records.length; i++) {
            const patient = await Patient.findById(records[i].patient_id).lean()
            // Change the format of createAt to YYYY/MM/DD
            const createdAt = records[i].createdAt.toISOString().split('T')[0]

            var comment = records[i].blood_glucose_level_commment
            if (comment) {
                const data = "doses of insulin taken commment"
                var commentVar = {patient: patient, data: data, text: comment, createdAt: createdAt}
                comments.push(commentVar)
            }

            comment = records[i].weight
            if (comment) {
                const data = "weight"
                var commentVar = {patient: patient, data: data, text: comment, createdAt: createdAt}
                comments.push(commentVar)
            }

            comment = records[i].doses_of_insulin_taken_commment
            if (comment) {
                const data = "doses of insulin taken"
                var commentVar = {patient: patient, data: data, text:comment, createdAt: createdAt}
                comments.push(commentVar)
            }

            comment = records[i].exercise_commment
            if (comment) {
                const data = "exercise"
                var commentVar = {patient: patient, data: data, text:comment, createdAt: createdAt}
                comments.push(commentVar)
            }
        }
        return res.render('commentlist', {comments: comments})
    } catch (err) { 
        return next(err) 
    } 
}

const changeDataRange = async (req,res) => {
    
}

module.exports = {
    getCurrentDoctor,
    getAllPatientData,
    getPatientById,
    getPatientChartById,
    getPatientMessages,
    getComments,
    changeDataRange,
} 