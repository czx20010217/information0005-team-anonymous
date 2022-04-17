const exphbs = require('express-handlebars')
require('./models')
// Import express
const express = require('express')
// Set your app up as an express app
const app = express()

// configure Handlebars
app.engine(
    'hbs',
    exphbs.engine({
        defaultLayout: 'main',
        extname: 'hbs',
    })
)
// set Handlebars view engine
app.set('view engine', 'hbs')

app.use(express.static('public'))

// log all request
app.use((req,res,next) => {
    console.log('message arrived: ' + req.method + ' ' + req.path)
    next()
})

// Set up to handle POST requests
app.use(express.json()) // needed if POST data is in JSON format
app.use(express.urlencoded({ extended: false })) // only needed for URL-encoded input

// link to our router
const peopleRouter = require('./routes/peopleRouter')
const doctorRouter = require('./routes/doctorRouter')

// the demo routes are added to the end of the '/people' path
app.use('/people', peopleRouter)
app.use('/doctor', doctorRouter)

// Tells the app to send the string: "Our demo app is working!" when you hit the '/' endpoint.
app.get('/', (req, res) => {
    res.render('index.hbs')
})

// Tells the app to listen on port 3000 and logs that information to the console.
app.listen(process.env.PORT || 3000, () => {
    console.log('Demo app is listening on port 3000!')
})
