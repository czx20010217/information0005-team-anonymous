const Patient = require('../models/patient')
const Record = require('../models/record')

var stringify = require('json-stringify-safe');

const getPatientById = async(req, res, next) => { 
    try { 
        const patient = await Patient.findById(req.params.patient_id).lean() 
        const records = await Record.find({patient_id: req.params.patient_id});
        if (!patient) { 
            // no author found in database
            return res.sendStatus(404) 
        }
        // found person 
        return res.render('onePatient', { oneItem: patient, recordList: records})
    } catch (err) { 
        return next(err) 
    } 
} 
module.exports = {
    getPatientById, 
} 