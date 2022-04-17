const express = require('express')

// create our Router object
const patientRouter = express.Router()

// import people controller functions
const patientController = require('../controllers/patientController')

// add a route to handle the GET request for all people data
peopleRouter.get('/', peopleController.getAllPeopleData)

// add a route to handle the GET request for one data instance
peopleRouter.get('/:patient_id', peopleController.getDataById)

// export the router
module.exports = peopleRouter
