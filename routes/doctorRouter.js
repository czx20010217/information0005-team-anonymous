const express = require('express')

// create our Router object
const doctorRouter = express.Router()

// import people controller functions
const doctorController = require('../controllers/doctorController')

// add a route to handle the GET request for all patient data
doctorRouter.get('/', doctorController.getAllPatientData)

// add a route to handle the GET request for one data instance
doctorRouter.get('/patientDetail/:patient_id', doctorController.getPatientById)

// export the router
module.exports = doctorRouter
