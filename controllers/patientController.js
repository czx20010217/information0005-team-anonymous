const Patient = require('../models/patient')
const Record = require('../models/record')
const User = require('../models/user')
const Engagement = require('../models/engagement')
const Message = require('../models/message')
const Doctor = require('../models/doctor')

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
    try {
        // get current user
        const patient = await getCurrentpatient(req)
        patient_id = patient._id

        // get current date
        var now = new Date()
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())

        // check and avoid same record for same patient in one day
        const record = await Record.findOne({patient_id: patient_id, updatedAt: {$gte: startOfToday}})
        if (record && record.submitted){
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
        if (record){
            // update existing record
            record.blood_glucose_level = blood_glucose_level
            record.blood_glucose_level_commment = blood_glucose_level_commment
            record.weight = weight
            record.weight_commment = weight_commment
            record.doses_of_insulin_taken = doses_of_insulin_taken
            record.doses_of_insulin_taken_commment = doses_of_insulin_taken_commment
            record.exercise = exercise
            record.exercise_commment = exercise_commment
            record.submitted = submitted
            record.save()
        }else{
            // add and save new record
            const newRecord = new Record({ patient_id, submitted, 
                blood_glucose_level, blood_glucose_level_commment, 
                weight, weight_commment, 
                doses_of_insulin_taken, doses_of_insulin_taken_commment, 
                exercise, exercise_commment});

            newRecord.save();
        }
        const currentEngagement = await Engagement.findOne({patient_id: patient_id})
        await Engagement.updateOne({patient_id: patient_id}, {engage_count: currentEngagement.engage_count + 1})
        return res.render('recordSubmited', { layout: false, submitted: submitted }) 
    } catch (err) { 
        return next(err) 
    }
}

// save records
const saveRecord = async (req,res) => {
    try {
        // get current user
        const patient = await getCurrentpatient(req)
        patient_id = patient._id

        // get current date
        var now = new Date()
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())

        // check and avoid same record for same patient in one day
        const record = await Record.findOne({patient_id: patient_id, updatedAt: {$gte: startOfToday}})
        if (record && record.submitted){
            res.render("recordSubmited", {layout: false})
            return
        }

        // create and save new record
        const {
            blood_glucose_level, blood_glucose_level_commment, 
            weight, weight_commment, 
            doses_of_insulin_taken, doses_of_insulin_taken_commment, 
            exercise, exercise_commment} = req.body;

        submitted = false
        if (record){
            // update existing record
            record.blood_glucose_level = blood_glucose_level
            record.blood_glucose_level_commment = blood_glucose_level_commment
            record.weight = weight
            record.weight_commment = weight_commment
            record.doses_of_insulin_taken = doses_of_insulin_taken
            record.doses_of_insulin_taken_commment = doses_of_insulin_taken_commment
            record.exercise = exercise
            record.exercise_commment = exercise_commment
            record.submitted = submitted
            record.save()
        }else{
            // add and save new record
            const newRecord = new Record({ patient_id, submitted, 
                blood_glucose_level, blood_glucose_level_commment, 
                weight, weight_commment, 
                doses_of_insulin_taken, doses_of_insulin_taken_commment, 
                exercise, exercise_commment});

            newRecord.save();
        }

        
        return res.render('recordSubmited', { layout: false, submitted: submitted }) 
    } catch (err) { 
        return next(err) 
    }
}

const getDashBoard = async (req,res) => {
    try {
        // get current logged in user
        const patient = await getCurrentpatient(req)
        var engagement = await Engagement.findOne({patient_id: patient._id}).lean()
        // calculate engagement rate
        var now = new Date()
        var time_diff = now.getTime() - engagement.createdAt.getTime()
        var day_diff = Math.floor(time_diff / (1000 * 3600 * 24) + 1)
        var engagement_rate = Math.round((engagement.engage_count / day_diff) * 100)

        var over_eight = false
        if (engagement_rate>= 80){
            over_eight = true
        }

        return res.render('patientDashboard.hbs', {layout: false, patient: patient, engagement_rate: engagement_rate, over_eight: over_eight})
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
        if (record && record.submitted){
            res.render("recordAlreadySubmitted", {layout: false})
            return
        }
        return res.render('addRecords', {layout: false, patient: patient, record: record })
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

        return res.render('myrecords', {layout: false, patient: patient, records: records})
    } catch (err) { 
        return next(err) 
    } 
}

const getLeaderboard = async (req,res, next) => {
    // get current date
    var now = new Date()

    try { 
        const current_patient = await getCurrentpatient(req)
        var own_engagement
        var engagements = await Engagement.find().lean()
        for (let i = 0; i < engagements.length; i++) {
            var time_diff = now.getTime() - engagements[i].createdAt.getTime()
            var day_diff = Math.floor(time_diff / (1000 * 3600 * 24) + 1)
            var engagement_rate = Math.round((engagements[i].engage_count / day_diff) * 100)
            engagements[i].engagement_rate = Math.max(engagements, 100)
            engagements[i].engagement_rate = Math.min(engagements, 0)
            engagements[i].engagement_rate = engagement_rate

            const patient = await Patient.findById(engagements[i].patient_id).lean()
            engagements[i].patient = patient

            if (engagements[i].patient_id == current_patient._id){
                own_engagement = engagements[i]
            }
        }
        engagements.sort((a, b) => parseFloat(a.engagement_rate) - parseFloat(b.engagement_rate));
        engagements = engagements.reverse()
        engagements = engagements.slice(0, 5)

        return res.render('leaderboard', {layout: false, engagements: engagements, own_engagement: own_engagement})
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

const changePassword = async (req,res, next) => {
    try {
        const {
            username, new_password, secret } = req.body;

        const user = await User.findOne({username: username})
        if (user.secret != secret){
            console.log("mismatch")
            return res.render('EnterSecurity', {layout: false, missMatch: true})
        }

        user.password = new_password;
        await user.save()

        return res.render('EnterSecurity', {layout: false})
    } catch (err) { 
        return next(err) 
    } 
}

const getSupprotMessage = async (req,res, next) => {
    try {
        const patient = await getCurrentpatient(req)
        var messages = await Message.find({patient_id: patient._id}).lean()

        for (let i = 0; i < messages.length; i++) {
            messages[i].createdAt = messages[i].createdAt.toISOString().split('T')[0].replaceAll('-', '/')
            var doctor = Doctor.findById(messages[i].doctor_id).lean
            messages[i].doctor = doctor
        }

        return res.render('supportmessage', {layout: false, messages: messages})
    } catch (err) { 
        return next(err) 
    } 
}

const getMorePage = async (req,res, next) => {
    try {

        return res.render('more', {layout: false})
    } catch (err) { 
        return next(err) 
    } 
}

module.exports = {
    insertRecord, 
    saveRecord, 
    getDashBoard, 
    addDailyRecord, 
    myRecords, 
    getHomePage, 
    getLeaderboard, 
    getSecurityPage, 
    getSupprotMessage, 
    changePassword, 
    getMorePage
}