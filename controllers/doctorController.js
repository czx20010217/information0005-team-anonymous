const Patient = require('../models/patient')
const Record = require('../models/record')
const Doctor = require('../models/doctor')
const Engagement = require('../models/engagement')
const User = require('../models/user');
const Message = require('../models/message')
const Note = require('../models/note')


const getCurrentDoctor = async (req) => {
    const user_id = req.user._id
    const doctor = await Doctor.findOne({user_id: user_id}).lean()
    return doctor
}

const getAllPatientData = async (req, res, next) => {
    
    try { 
        // get current date
        var now = new Date()
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        // get curent logged in doctor
        const current_doctor = await getCurrentDoctor(req)
        var patients = await Patient.find({doctor_id: current_doctor._id}).lean()
        var patient_ids = [];
        for(let i = 0; i < patients.length; i++){
            patient_ids.push(patients[i]._id);
        }

        var records = await Record.find({patient_id: patient_ids, createdAt: {$gte: startOfToday}}).sort('-createdAt').lean()
        for (let i = 0; i < records.length; i++) {
            const patient = await Patient.findById(records[i].patient_id).lean()
            records[i].patient = patient
            // Change the format of createAt to YYYY/MM/DD
            records[i].createdAt = records[i].createdAt.toISOString().split('T')[0]
        }
        return res.render('doctorDashboard', { layout: false , data: records, doctor: current_doctor}) 
    } catch (err) { 
        return next(err) 
    }
} 

/*
    Find the patient infomation and their records by ID (show with table)
*/
const getPatientById = async(req, res, next) => { 
    try { 
        const patient = await Patient.findById(req.params.patient_id).lean()
        const records = await Record.find({patient_id: req.params.patient_id}).sort('-createdAt').lean()
        if (!patient) { 
            // no patient found in database
            return res.sendStatus(404)
        }
        // found person 
        for (let i = 0; i < records.length; i++) {
            records[i].patient = patient
            // Change the format of createAt to YYYY/MM/DD
            records[i].createdAt = records[i].createdAt.toISOString().split('T')[0]
        }
        return res.render('onePatient', { patient: patient, recordList: records})
    } catch (err) { 
        return next(err) 
    } 
} 

const addPatientPage = async(req, res, next) => { 
    try { 
        return res.render('addNewPatient', { layout: false })
    } catch (err) { 
        return next(err) 
    } 
} 

const insertNewPatient = async(req, res, next) => { 
    try { 
        const doctor = await getCurrentDoctor(req)
        const {
            first_name, last_name, gender, 
            blood_glucose_level, weight, dose_of_insulin_taken, exercise, 
            blood_glucose_level_minimum, blood_glucose_level_maximum, weight_minimum, weight_maximum, 
            doses_of_insulin_taken_minimum, doses_of_insulin_taken_maximum, exercise_minimum, exercise_maximum, 
            username, password, secret} = req.body;

        const existingUser = await User.findOne({username: username}).lean()
        if (existingUser){
            return res.render('addNewPatient', { layout: false, repeat: true })
        }

        if (password.length < 8){
            console.log("password length not enough")
            return res.render('addNewPatient', {layout: false, passwordLen: true})
        }

        var need_blood_glucose_level = false, need_weight = false, need_doses_of_insulin_taken = false, need_exercise = false

        if (blood_glucose_level == "on"){
            var need_blood_glucose_level = true
        }
        if (weight == "on"){
            var need_weight = true
        }
        if (dose_of_insulin_taken == "on"){
            var need_doses_of_insulin_taken = true
        }
        if (exercise == "on"){
            var need_exercise = true
        }

        var user_type = 'patient'
        const newUser = new User({username, password, user_type, secret})
        const newPatient = new Patient({user_id: newUser._id, first_name, last_name, gender, doctor_id: doctor._id, 
            blood_glucose_level_minimum, blood_glucose_level_maximum, weight_minimum, weight_maximum, 
            doses_of_insulin_taken_minimum, doses_of_insulin_taken_maximum, exercise_minimum, exercise_maximum, 
            need_blood_glucose_level, need_weight, need_doses_of_insulin_taken, need_exercise})

        const newEngagement = new Engagement({patient_id: newPatient._id, engage_count: 0})
        newUser.save()
        newPatient.save()
        newEngagement.save()

        return res.render('registrationSuccessful', { layout: false })
    } catch (err) { 
        return next(err) 
    } 
} 

const getUpdatePatientPage = async(req, res, next) => { 
    try { 
        const patient = await Patient.findById(req.params.patient_id).lean()
        
        return res.render('updatePatient', { layout: false, patient: patient })
    } catch (err) { 
        return next(err) 
    } 
} 

const updatePatient = async(req, res, next) => { 
    try { 
        const patient = await Patient.findById(req.params.patient_id)
        const {
            blood_glucose_level, weight, dose_of_insulin_taken, exercise, 
            blood_glucose_level_minimum, blood_glucose_level_maximum, weight_minimum, weight_maximum, 
            doses_of_insulin_taken_minimum, doses_of_insulin_taken_maximum, exercise_minimum, exercise_maximum, } = req.body;

        var need_blood_glucose_level = false, need_weight = false, need_doses_of_insulin_taken = false, need_exercise = false

        if (blood_glucose_level == "on"){
            var need_blood_glucose_level = true
        }
        if (weight == "on"){
            var need_weight = true
        }
        if (dose_of_insulin_taken == "on"){
            var need_doses_of_insulin_taken = true
        }
        if (exercise == "on"){
            var need_exercise = true
        }

        patient.blood_glucose_level_minimum = blood_glucose_level_minimum
        patient.blood_glucose_level_maximum = blood_glucose_level_maximum
        patient.weight_minimum = weight_minimum
        patient.weight_maximum = weight_maximum
        patient.doses_of_insulin_taken_minimum = doses_of_insulin_taken_minimum
        patient.doses_of_insulin_taken_maximum = doses_of_insulin_taken_maximum
        patient.exercise_minimum = exercise_minimum
        patient.exercise_maximum = exercise_maximum

        patient.need_blood_glucose_level = need_blood_glucose_level
        patient.need_weight = need_weight
        patient.need_doses_of_insulin_taken = need_doses_of_insulin_taken
        patient.need_exercise = need_exercise

        await patient.save()

        return res.redirect('/doctor/patientDetail/' + req.params.patient_id)
    } catch (err) { 
        return next(err) 
    } 
} 

const getPatientMessages = async(req, res, next) => {
    try {
        const patient = await Patient.findById(req.params.patient_id).lean()
        const messages = await Message.find({patient_id: patient._id}).sort('-createdAt').lean()

        for (let i = 0; i < messages.length; i++) {
            // Change the format of createAt to YYYY-MM-DD
            messages[i].createdAt = messages[i].createdAt.toISOString().split('T')[0].replaceAll('-', '/')
        }

        return res.render('DoctorSupportMessage', {layout: false, patient: patient, messages: messages})
    } catch (err) { 
        return next(err) 
    }
}

const getPatientNotes = async(req, res, next) => {
    try {
        const patient = await Patient.findById(req.params.patient_id).lean()
        const notes = await Note.find({patient_id: patient._id}).sort('-createdAt').lean()

        for (let i = 0; i < notes.length; i++) {
            // Change the format of createAt to YYYY-MM-DD
            notes[i].createdAt = notes[i].createdAt.toISOString().split('T')[0].replaceAll('-', '/')
        }

        return res.render('notesHistory', {layout: false, patient: patient, notes: notes})
    } catch (err) { 
        return next(err) 
    }
}

const getComments  = async(req, res, next) => {
    try { 
        // get curent logged in doctor
        const current_doctor = await getCurrentDoctor(req)
        var patients = await Patient.find({doctor_id: current_doctor._id}).lean()
        var patient_ids = [];
        for(let i = 0; i < patients.length; i++){
            patient_ids.push(patients[i]._id);
        }
        var records = await Record.find({patient_id: patient_ids}).sort('-createdAt').lean()
        let comments = new Array()

        for (let i = 0; i < records.length; i++) {
            const patient = await Patient.findById(records[i].patient_id).lean()
            // Change the format of createAt to YYYY/MM/DD
            const createdAt = records[i].createdAt.toISOString().split('T')[0]

            var comment = records[i].blood_glucose_level_commment
            if (comment) {
                const data = "doses of insulin taken commment"
                var commentVar = {patient: patient, data: data, text: comment, createdAt: createdAt}
                comments.push(commentVar)
            }

            comment = records[i].weight
            if (comment) {
                const data = "weight"
                var commentVar = {patient: patient, data: data, text: comment, createdAt: createdAt}
                comments.push(commentVar)
            }

            comment = records[i].doses_of_insulin_taken_commment
            if (comment) {
                const data = "doses of insulin taken"
                var commentVar = {patient: patient, data: data, text:comment, createdAt: createdAt}
                comments.push(commentVar)
            }

            comment = records[i].exercise_commment
            if (comment) {
                const data = "exercise"
                var commentVar = {patient: patient, data: data, text:comment, createdAt: createdAt}
                comments.push(commentVar)
            }
        }
        return res.render('commentlist', {comments: comments})
    } catch (err) { 
        return next(err) 
    } 
}

const editPatientData = async (req, res, next) => {
    try {
        const {
            glucoseMin, glucoseMax, needGlucose, 
            weightMin, weightMax, needWeight,
            doseMin, doseMax, needDose,
            exerciseMin, exerciseMax, needExercise, 
            note, supportMessage} = req.body

        const patient = await Patient.findById(req.params.patient_id)

        if (glucoseMin != undefined) {
            patient.blood_glucose_level_minimum = Math.max(glucoseMin, 0)
            patient.blood_glucose_level_maximum = Math.max(glucoseMax, 0)

            if (needGlucose == "on"){
                patient.need_blood_glucose_level = true
            } else {
                patient.need_blood_glucose_level = false
            }
            await patient.save()

        } else if (weightMin != undefined) {
            patient.weight_minimum = Math.max(weightMin, 0)
            patient.weight_maximum = Math.max(weightMax, 0)

            if (needWeight == "on"){
                patient.need_weight = true
            } else {
                patient.need_weight = false
            }
            await patient.save()

        } else if (doseMin != undefined) {
            patient.doses_of_insulin_taken_minimum = Math.max(doseMin, 0)
            patient.doses_of_insulin_taken_maximum = Math.max(doseMax, 0)

            if (needDose == "on"){
                patient.need_doses_of_insulin_taken = true
            } else {
                patient.need_doses_of_insulin_taken = false
            }
            await patient.save()

        } else if (exerciseMin != undefined) {
            patient.exercise_minimum = Math.max(exerciseMin, 0)
            patient.exercise_maximum = Math.max(exerciseMax, 0)

            if (needExercise == "on"){
                patient.need_exercise = true
            } else {
                patient.need_exercise = false
            }
            await patient.save()

        } else if (note != undefined) {
            const newNote = new Note({patient_id: req.params.patient_id, text: note})
            await newNote.save()

        } else if (supportMessage != undefined) {
            const newMessage = new Message({patient_id: req.params.patient_id, 
                doctor_id: req.user._id, text: supportMessage})
            await newMessage.save()
        }

        // this page shows chart (it is in the chartview page) instead of table
        if (req.url.search("chartview") != -1) {
            return res.redirect('/doctor/patientDetail/' + req.params.patient_id + '/chartview')
        } else {
            return res.redirect('/doctor/patientDetail/' + req.params.patient_id)
        }
    } catch (err) { 
        return next(err) 
    } 
}

/*
    Find the patient infomation and their records by ID (show chart instead of table)
*/
const getPatientChartById = async(req, res, next) => { 
    try { 
        const patient = await Patient.findById(req.params.patient_id).lean()
        const records = await Record.find({patient_id: req.params.patient_id}).sort('-createdAt').lean()
        if (!patient) { 
            // no patient found in database
            return res.sendStatus(404)
        }
        // found person 
        for (let i = 0; i < records.length; i++) {
            records[i].patient = patient
            // Change the format of createAt to YYYY/MM/DD
            records[i].createdAt = records[i].createdAt.toISOString().split('T')[0]
        }
        return res.render('onePatientChartview', { patient: patient, recordList: records})
    } catch (err) { 
        return next(err) 
    } 
} 

module.exports = {
    getCurrentDoctor,
    getAllPatientData,
    getPatientById, 
    addPatientPage, 
    insertNewPatient, 
    getPatientChartById,
    getPatientMessages,
    getPatientNotes,
    getComments,
    updatePatient, 
    getUpdatePatientPage, 
    editPatientData,
} 