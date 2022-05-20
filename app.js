const exphbs = require('express-handlebars')
require('./models')
// Import express
const express = require('express')
// Import flash and session
const flash = require('express-flash')
const session = require('express-session')
const schedule = require('node-schedule');

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

// Flash messages for failed logins, and (possibly) other success/error messages
app.use(flash())

// Track authenticated users through login sessions
app.use(
    session({
        // The secret used to sign session cookies (ADD ENV VAR)
        secret: process.env.SESSION_SECRET || 'keyboard cat',
        name: 'demo', // The cookie name (CHANGE THIS)
        saveUninitialized: false,
        resave: false,
        cookie: {
            sameSite: 'strict',
            httpOnly: true,
            secure: app.get('env') === 'production'
        },
    })
)

if (app.get('env') === 'production') {
    app.set('trust proxy', 1); // Trust first proxy
}
// Initialise Passport.js
const passport = require('./passport')
app.use(passport.authenticate('session'))

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

// generate empty records for each patient at 0:10:0 everyday
const patientController = require('./controllers/patientController')
let job = schedule.scheduleJob('0 10 0 * * *', () => {
    console.log("start generating empty records")
    patientController.createEmptyRecord()
});
