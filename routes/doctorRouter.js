const express = require('express')
const passport = require('passport')

// create our Router object
const doctorRouter = express.Router()

// import people controller functions
const doctorController = require('../controllers/doctorController')

// Authentication middleware
const isAuthenticated = (req, res, next) => {
    // If user is not authenticated via passport, redirect to login page
    if (!req.isAuthenticated()) {
        return res.redirect('./login')
    }
    if (req.user.user_type != 'doctor'){
        req.logout()
        return res.redirect('./login')
    }
    // Otherwise, proceed to next middleware function
    return next()
}

// Login page (with failure message displayed upon login failure)
doctorRouter.get('/login', (req, res) => {
    res.render('DoctorLogin', { flash: req.flash('error'), title: 'Login' })
})

// Handle login
doctorRouter.post('/login',
    passport.authenticate('local', {
        successRedirect: './dashboard', failureRedirect: './login', failureFlash: true
    })
)
// Handle logout
doctorRouter.get('/logout', (req, res) => {
    req.logout()
    res.redirect('./login')
})

// add a route to handle the GET request for all patient data
doctorRouter.get('/dashboard', isAuthenticated, doctorController.getAllPatientData)

// add routes to handle the editing of the setting of the patient data
doctorRouter.post('/patientDetail/:patient_id', isAuthenticated, doctorController.changeGlucose)
doctorRouter.post('/patientDetail/:patient_id', isAuthenticated, doctorController.changeWeight)
doctorRouter.post('/patientDetail/:patient_id', isAuthenticated, doctorController.changeDose)
doctorRouter.post('/patientDetail/:patient_id', isAuthenticated, doctorController.changeExercise)

// add routes to handle the inserting of the setting of note and message for patient
doctorRouter.post('/patientDetail/:patient_id', isAuthenticated, doctorController.addNote)
doctorRouter.post('/patientDetail/:patient_id', isAuthenticated, doctorController.addMessage)
// add a route to handle the GET request for one data instance
doctorRouter.get('/patientDetail/:patient_id', isAuthenticated, doctorController.getPatientById)

doctorRouter.get('/addNewPatient', isAuthenticated, doctorController.addPatientPage)
doctorRouter.post('/addNewPatient', isAuthenticated, doctorController.insertNewPatient)
doctorRouter.get('/patientDetail/:patient_id/chartview', isAuthenticated, doctorController.getPatientChartById)

doctorRouter.get('/patientDetail/:patient_id/message', isAuthenticated, doctorController.getPatientMessages)

doctorRouter.get('/patientDetail/:patient_id/note', isAuthenticated, doctorController.getPatientNotes)

doctorRouter.get('/comment', isAuthenticated, doctorController.getComments)



// export the router
module.exports = doctorRouter
