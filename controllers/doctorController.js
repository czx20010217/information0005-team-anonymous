const Patient = require('../models/patient')
const Record = require('../models/record')

var stringify = require('json-stringify-safe');
const getAllPatientData = async (req, res, next) => {
    try { 
        var records = await Record.find().sort('-createdAt').lean()
        records = records.slice(-10)
        for (let i = 0; i < records.length; i++) {
            const patient = await Patient.findById(records[i].patient_id).lean()
            records[i].patient = patient
            records[i].createdAt = records[i].createdAt.toISOString().split('T')[0]
        }
        return res.render('doctorDashboard', { layout: false , data: records}) 
    } catch (err) { 
        return next(err) 
    }
} 

const getPatientById = async(req, res, next) => { 
    try { 
        const patient = await Patient.findById(req.params.patient_id).lean()
        const records = await Record.find({patient_id: req.params.patient_id}).lean()
        if (!patient) { 
            // no patient found in database
            return res.sendStatus(404) 
        }
        // found person 
        return res.render('onePatient', { oneItem: patient, recordList: records})
    } catch (err) { 
        return next(err) 
    } 
} 
module.exports = {
    getAllPatientData,
    getPatientById, 
} 