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
        return res.redirect('/doctor/login')
    }
    if (req.user.user_type != 'doctor'){
        req.logout()
        return res.redirect('/doctor/login')
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
    res.redirect('/doctor/login')
})

// add a route to handle the GET request for all patient data
doctorRouter.get('/dashboard', isAuthenticated, doctorController.getAllPatientData)

// add routes to handle the editing of the setting of the patient data, adding note and message
doctorRouter.post('/patientDetail/:patient_id', isAuthenticated, doctorController.editPatientData)
// add a route to handle the GET request for one data instance
doctorRouter.get('/patientDetail/:patient_id', isAuthenticated, doctorController.getPatientById)

doctorRouter.post('/patientDetail/:patient_id/chartview', isAuthenticated, doctorController.editPatientData)
doctorRouter.get('/patientDetail/:patient_id/chartview', isAuthenticated, doctorController.getPatientChartById)

doctorRouter.get('/addNewPatient', isAuthenticated, doctorController.addPatientPage)
doctorRouter.post('/addNewPatient', isAuthenticated, doctorController.insertNewPatient)

doctorRouter.get('/patientDetail/:patient_id/message', isAuthenticated, doctorController.getPatientMessages)

doctorRouter.get('/patientDetail/:patient_id/note', isAuthenticated, doctorController.getPatientNotes)

doctorRouter.get('/comment', isAuthenticated, doctorController.getComments)

doctorRouter.get('/patientDetail/:patient_id/update', isAuthenticated, doctorController.getUpdatePatientPage)
doctorRouter.post('/patientDetail/:patient_id/update', isAuthenticated, doctorController.updatePatient)



// export the router
module.exports = doctorRouter
