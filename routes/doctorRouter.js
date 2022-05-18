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
doctorRouter.post('/logout', (req, res) => {
    req.logout()
    res.redirect('./')
})

// add a route to handle the GET request for all patient data
doctorRouter.get('/dashboard', isAuthenticated, doctorController.getAllPatientData)

// add a route to handle the GET request for one data instance
doctorRouter.post('/patientDetail/:patient_id', isAuthenticated, doctorController.changeDataRange)
doctorRouter.get('/patientDetail/:patient_id', isAuthenticated, doctorController.getPatientById)

doctorRouter.get('/addNewPatient', isAuthenticated, doctorController.addPatientPage)
doctorRouter.post('/addNewPatient', isAuthenticated, doctorController.insertNewPatient)
doctorRouter.get('/patientDetail/:patient_id/chartview', isAuthenticated, doctorController.getPatientChartById)

doctorRouter.get('/patientDetail/:patient_id/message', isAuthenticated, doctorController.getPatientMessages)

doctorRouter.get('/comment', isAuthenticated, doctorController.getComments)



// export the router
module.exports = doctorRouter
