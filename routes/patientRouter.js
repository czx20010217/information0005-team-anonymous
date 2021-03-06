const express = require('express')
const passport = require('passport')

// create our Router object
const patientRouter = express.Router()

// import people controller functions
const patientController = require('../controllers/patientController')

// Authentication middleware
const isAuthenticated = (req, res, next) => {
    // If user is not authenticated via passport, redirect to login page
    if (!req.isAuthenticated()) {
        return res.redirect('./login')
    }
    if (req.user.user_type != 'patient'){
        req.logout()
        return res.redirect('./login')
    }
    // Otherwise, proceed to next middleware function
    return next()
}

// Login page (with failure message displayed upon login failure)
patientRouter.get('/login', (req, res) => {
    res.render('PatientLogin', { flash: req.flash('error'), title: 'Login' })
})

// Handle login
patientRouter.post('/login',
    passport.authenticate('local', {
        successRedirect: './dashboard', failureRedirect: './login', failureFlash: true
    })
)
// Handle logout
patientRouter.get('/logout', (req, res) => {
    req.logout()
    res.redirect('./dashboard')
})

// page do not reauire login
patientRouter.get('/home', (req, res) => {
    res.render('home')
})
patientRouter.get('/aboutThisWebsite', (req, res) => {
    res.render('AboutThisWebsite')
})
patientRouter.get('/aboutDiabetes', (req, res) => {
    res.render('AboutDiabetes')
})

patientRouter.get('/changePassword', patientController.getSecurityPage)
patientRouter.post('/changePassword', patientController.changePassword)

// add a route to handle the GET request for all people data
patientRouter.post('/addDailyRecord', isAuthenticated, patientController.insertRecord)
patientRouter.post('/addDailyRecord/save', isAuthenticated, patientController.saveRecord)
patientRouter.get('/addDailyRecord', isAuthenticated, patientController.addDailyRecord)

patientRouter.get('/dashboard', isAuthenticated, patientController.getDashBoard)

patientRouter.get('/myRecords', isAuthenticated, patientController.myRecords)

patientRouter.get('/leaderBoard', isAuthenticated, patientController.getLeaderboard)

patientRouter.get('/supportMessage', isAuthenticated, patientController.getSupprotMessage)

patientRouter.get('/more', isAuthenticated, patientController.getMorePage)


// export the router
module.exports = patientRouter
