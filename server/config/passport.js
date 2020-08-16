'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoose = require('mongoose');
const User = mongoose.model('user');

/**
 * Sets up the Passport Library to be used in the application
 * 
 * @author rohan_bharti
 */

/**
 * Used to authenticate the user when attempting to log in. Returns the user object is successfully authenticated else throws an error
 */
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, (email, password, done) => {
    let promise = User.findOne({ email: email }).exec();
    promise.then((user) => {
        if (!user || !user.checkPasswordValidity(password)) {
            return done(null, false, { errors: { "Email or Password": "Invalid credentials entered!" } })
        }
        return done(null, user);
    }).catch(done);
}));