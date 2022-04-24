const express = require('express')

// create our Router object
const patientRouter = express.Router()

// import people controller functions
const patientController = require('../controllers/patientController')

// add a route to handle the GET request for all people data
patientRouter.post('/addDailyRecord', patientController.insertRecord)

// export the router
module.exports = patientRouter
