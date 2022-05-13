const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const User = require('./models/user')

// create user if there is no
User.find({}, (err, users) => {
    if (users.length > 0) return;
    User.create({ username: 'Pat', password: 'pass', user_type: 'patient', secret: 'INFO30005' }, (err) => {
    if (err) { console.log(err); return; }
        console.log('Dummy user inserted')
    })
})


// Serialize information to be stored in session/cookie
passport.serializeUser((user, done) => {
    // Use id to serialize user
    done(undefined, user._id)
})
// When a request comes in, deserialize/expand the serialized information
// back to what it was (expand from id to full user)
passport.deserializeUser((userId, done) => {
    User.findById(userId, { password: 0 }, (err, user) => {
        if (err) {
            return done(err, undefined)
        }
        return done(undefined, user)
    })
})

// Updated LocalStrategy function
passport.use(
    new LocalStrategy((username, password, done) => {
    User.findOne({ username }, {}, {}, (err, user) => {
        if (err) {
            return done(undefined, false, {
                message: 'Unknown error has occurred'
            })
        }
        if (!user) {
            return done(undefined, false, {
                message: 'Incorrect username or password',
            })
        }
        // Check password
        user.verifyPassword(password, (err, valid) => {
                if (err) {
                    return done(undefined, false, {
                    message: 'Unknown error has occurred'
                    })
                }
                if (!valid) {
                    return done(undefined, false, {
                        message: 'Incorrect username or password',
                    })
                }
                // If user exists and password matches the hash in the database
                return done(undefined, user)
            })
        })
    })
)
module.exports = passport