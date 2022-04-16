// import people model
const peopleData = require('../models/peopleModel')

// handle request to get all people data instances
const getAllPeopleData = (req, res) => {
    res.render('allData', { data: peopleData })
}

// handle request to get one data instance
const getDataById = (req, res) => {
    // search the database by ID
    const data = peopleData.find((data) => data.id === req.params.id)

    // return data if this ID exists
    if (data) {
        res.render('oneData', { oneItem: data })
    } else {
        // You can decide what to do if the data is not found.
        // Currently, an empty list will be returned.
        res.sendStatus(404)
    }
}

const insertData = (req, res) => {
    const { id, first_name, last_name } = req.body
    peopleData.push({ id, first_name, last_name })
    return res.redirect('back')
}

// exports an object, which contain functions imported by router
module.exports = {
    getAllPeopleData,
    getDataById,
    insertData,
}
