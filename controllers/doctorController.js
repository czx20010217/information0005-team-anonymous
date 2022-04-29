const Patient = require('../models/patient')
const Record = require('../models/record')

var stringify = require('json-stringify-safe');

const getAllPatientData = async (req, res, next) => {
    try { 
        var records = await Record.find().sort('-createdAt').lean()
        for (let i = 0; i < records.length; i++) {
            const patient = await Patient.findById(records[i].patient_id).lean()
            records[i].patient = patient
            // Change the format of createAt to YYYY/MM/DD
            records[i].createdAt = records[i].createdAt.toISOString().split('T')[0]
        }
        return res.render('doctorDashboard', { layout: false , data: records}) 
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
            // Change the format of createAt to YYYY/MM/DD
            records[i].createdAt = records[i].createdAt.toISOString().split('T')[0]
        }
        return res.render('onePatient', { patient: patient, recordList: records})
    } catch (err) { 
        return next(err) 
    } 
} 
module.exports = {
    getAllPatientData,
    getPatientById, 
} 