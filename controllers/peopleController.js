const Author = require('../models/author') 
const getAllPeopleData = async (req, res, next) => { 
    try { 
        const authors = await Author.find().lean() 
        return res.render('allData', { data: authors }) 
    } catch (err) { 
        return next(err) 
    } 
} 
const getDataById = async(req, res, next) => { 
    try { 
        const author = await Author.findById(req.params.author_id).lean() 
        if (!author) { 
            // no author found in database
            return res.sendStatus(404) 
        } 
        // found person 
        return res.render('oneData', { oneItem: author }) 
    } catch (err) { 
        return next(err) 
    } 
} 
module.exports = { 
    getAllPeopleData,
    getDataById, 
} 