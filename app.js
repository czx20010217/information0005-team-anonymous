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
        helpers: {
            outRange: function(value, min, max) {
                return value < min || value > max;
            }
        }
    })
)
// set Handlebars view engine
app.set('view engine', 'hbs')

app.use(express.static('public'));
app.use(express.static('media'));

// Set up to handle POST requests
app.use(express.json()) // needed if POST data is in JSON format
app.use(express.urlencoded({ extended: false })) // only needed for URL-encoded input

// link to our router
const doctorRouter = require('./routes/doctorRouter')
const patientRouter = require('./routes/patientRouter')

// manage routers
app.use('/doctor', doctorRouter)
app.use('/patient', patientRouter)

// health check for program
app.get('/', (req, res) => {
    res.render('index.hbs')
})

// Tells the app to listen on port 3000 and logs that information to the console.
app.listen(process.env.PORT || 3000, () => {
    console.log('Demo app is listening on port 3000!')
})
