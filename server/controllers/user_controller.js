'use strict';

/**
 * User Controller 
 * 
 * @author rohan_bharti
 */

const userService = require("./../services/user_service");
const passport = require('passport');
const dotenv = require('dotenv');
dotenv.config();
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Creates a new user and sets the response.
 *
 * @param request
 * @param response
 */
exports.create = (request, response) => {
    const user = Object.assign({}, request.body);
    const result = (savedUser) => {
        sendAccountCreationEmail(savedUser);
        response.status(201);
        response.json(savedUser.userModelJSON());
    }
    const promise = userService.save(user);
    promise
        .then(result)
        .catch(renderErrorResponse(response));
}

/**
 * Fetches the user by its id once authenticated.
 */
exports.fetch = (request, response) => {
    const id = request.payload.id;
    const result = (fetchedUser) => {
        response.status(200);
        response.json(fetchedUser.userModelJSON());
    }
    const promise = userService.get(id);
    promise
        .then(result)
        .catch(renderErrorResponse(response));
}

/**
 * Updates the user by its id once authenticated.
 */
exports.update = (request, response) => {
    const id = request.payload.id;
    const newUserInfoJson = Object.assign({}, request.body);
    const result = (fetchedUser) => {
        response.status(200);
        response.json(fetchedUser.userModelJSON());
    }
    const promise = userService.update(id, newUserInfoJson);
    promise
        .then(result)
        .catch(renderErrorResponse(response));
}

/**
 * Authenticates the user and logs him/her in. Takes in the supplied credentials and validates them, checks if a user exists with those credentials. Generates a Token to be used
 * for furture authentication as well.
 *
 * @param request
 * @param response
 */
exports.login = (req, res, next) => {
    if (!req.body.email) {
        return res.status(400).json({ errors: { email: "can't be blank." } });
    }
    if (!req.body.password) {
        return res.status(400).json({ errors: { password: "can't be blank." } });
    }
    if (Object.keys(req.body).length > 2) {
        return res.status(400).json({ errors: "Only Email and Password are allowed" });
    }

    passport.authenticate('local', { session: false }, function (err, passportUser, info) {
        if (err) { return next(err); }
        if (passportUser) {
            passportUser.token = passportUser.generateJWT();
            return res.json(passportUser.toAuthJSON());
        } else {
            return res.status(422).json(info);
        }
    })(req, res, next)
}

/**
 * Takes in the email of the user and sends a password recovery email to the user.
 */
exports.recoverPassword = (request, response) => {
    const requestBodyJson = Object.assign({}, request.body);
    const result = () => {
        response.status(200);
        response.json("Password Reset Email Sent Successfully!");
    }
    const promise = userService.recoverPassword(requestBodyJson);
    promise
        .then(result)
        .catch(renderErrorResponse(response));
}

/**
 * Once the user receives the OTP, the user's new password is saved with the authentication of the token
 */
exports.resetPassword = (request, response) => {
    const newPasswordJson = Object.assign({}, request.body);
    const result = () => {
        response.status(200);
        response.json("Password changed successfully!");
    }
    const promise = userService.resetPassword(newPasswordJson);
    promise
        .then(result)
        .catch(renderErrorResponse(response));
}

/**
 * Throws error if error object is present.
 *
 * @param {Response} response The response object
 * @return {Function} The error handler function.
 */
let renderErrorResponse = (response) => {
    const errorCallback = (error) => {
        if (error) {
            let status = error.status || 500;
            if (error.name === "CastError") {
                error.message = "The ID doesn't exist";
                status = 404;
            }
            if (error.name === "CustomBadRequest") {
                status = 400;
            }
            response.status(status);
            response.json({
                message: error.message
            });
        }
    };
    return errorCallback;
};

/**
 * Function for sending an email to the user on successful account creation
 * 
 * @param {*} user 
 */
let sendAccountCreationEmail = (user) => {
    const msg = {
        to: user.email,
        from: process.env.FROM_EMAIL,
        subject: 'Welcome to GoDutch',
        text: 'Hi ' + user.firstName + ' ' + user.lastName + ',\n\nWelcome to GoDutch! We are lucky to help you with your finances!',
    };
    sgMail.send(msg).catch((error) => {
        console.log(error.message);
    });
};