const Patient = require('../models/patient')
var stringify = require('json-stringify-safe');

const getPatientById = async(req, res, next) => { 
    try { 
        const patient = await Patient.findById(req.params.patient_id).lean() 
        if (!patient) { 
            // no author found in database
            return res.sendStatus(404) 
        } 
        // found person 
        return res.render('onePatient', { oneItem: stringify(patient) }) 
    } catch (err) { 
        return next(err) 
    } 
} 
module.exports = {
    getPatientById, 
} 