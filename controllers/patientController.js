const Patient = require('../models/patient')
const Record = require('../models/record')
const User = require('../models/user')
const Engagement = require('../models/engagement')

const getCurrentpatient = async (req) => {
    const user_id = req.user._id
    const patient = await Patient.findOne({user_id: user_id}).lean()
    return patient
}

const getHomePage = async (req, res, next) => {
    try {
        return res.render('Home', { layout: false }) 
    } catch (err) { 
        return next(err) 
    }
}

// add records
const insertRecord = async (req,res) => {
    // get current user
    const patient = await getCurrentpatient(req)
    patient_id = patient._id

    // get current date
    var now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    // check and avoid same record for same patient in one day
    const record = await Record.findOne({patient_id: patient_id, updatedAt: {$gte: startOfToday}}).lean()
    if (record){
        res.render("recordSubmited", {layout: false})
        return
    }

    // create and save new record
    const {
        blood_glucose_level, blood_glucose_level_commment, 
        weight, weight_commment, 
        doses_of_insulin_taken, doses_of_insulin_taken_commment, 
        exercise, exercise_commment} = req.body;

    submitted = true
    const newRecord = new Record({ patient_id, submitted, 
        blood_glucose_level, blood_glucose_level_commment, 
        weight, weight_commment, 
        doses_of_insulin_taken, doses_of_insulin_taken_commment, 
        exercise, exercise_commment});

    newRecord.save();
    const currentEngagement = await Engagement.findOne({patient_id: patient_id})
    await Engagement.updateOne({patient_id: patient_id}, {engage_count: currentEngagement.engage_count + 1})

    res.render("recordSubmited", {layout: false})
}

const getDashBoard = async (req,res) => {
    try {
        // get current logged in user
        const patient = await getCurrentpatient(req)

        return res.render('patientDashboard.hbs', {layout: false, patient: patient})
    } catch (err) { 
        return next(err) 
    } 
}

const addDailyRecord = async (req,res) => {
    try { 
        // get current date
        var now = new Date()
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())

        // get current logged in user
        const patient = await getCurrentpatient(req)

        // check and avoid same record for same patient in one day
        const record = await Record.findOne({patient_id: patient._id, updatedAt: {$gte: startOfToday}}).lean()
        if (record){
            res.render("recordAlreadySubmitted", {layout: false})
            return
        }
        return res.render('addRecords', {layout: false})
    } catch (err) { 
        return next(err) 
    } 
}

const myRecords = async (req,res) => {
    try { 
        const patient = await getCurrentpatient(req)
        var records = await Record.find({patient_id: patient._id}).sort('-createdAt').lean()
        for (let i = 0; i < records.length; i++) {
            // Change the format of createAt to YYYY/MM/DD
            records[i].createdAt = records[i].createdAt.toISOString().split('T')[0]
        }
        console.log(records)

        return res.render('myrecords', {layout: false, patient: patient, records: records})
    } catch (err) { 
        return next(err) 
    } 
}

const getLeaderboard = async (req,res, next) => {
    // get current date
    var now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    try { 
        var engagements = await Engagement.find().lean()
        for (let i = 0; i < engagements.length; i++) {
            var time_diff = startOfToday.getTime() - engagements[i].createdAt.getTime()
            var day_diff = Math.floor(time_diff / (1000 * 3600 * 24))
            engagements[i].engagement_rate = Math.round((engagements[i].engage_count / day_diff) * 100)
        }
        engagements.sort((a, b) => parseFloat(a.engagement_rate) - parseFloat(b.engagement_rate));
        engagements = engagements.slice(0, 5)
        engagements = engagements.reverse()

        return res.render('leaderboard', {layout: false, engagements: engagements})
    } catch (err) { 
        return next(err) 
    } 
}

const getSecurityPage = async (req,res, next) => {

    try {


        return res.render('EnterSecurity', {layout: false})
    } catch (err) { 
        return next(err) 
    } 
}

module.exports = {
    insertRecord, 
    getDashBoard, 
    addDailyRecord, 
    myRecords, 
    getHomePage, 
    getLeaderboard, 
    getSecurityPage, 
}