'use strict';

//impoorting the model
const mongoose = require('mongoose'),
    userModel = mongoose.model('user');
const validate = require('../models/user_validation');
const dotenv = require('dotenv');
dotenv.config();
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * User Service
 * 
 * @author rohan_bharti
 */

/**
 * Saves a new User to the database, takes in the jsonUser and creates a new hashed password using crypto
 */
exports.save = (jsonUser) => {
    let newUser = new userModel();
    newUser.firstName = jsonUser.firstName;
    newUser.lastName = jsonUser.lastName;
    newUser.email = jsonUser.email;

    if (!validate.isGoodPassword(jsonUser.password) || !validate.isLongEnough(jsonUser.password) || !validate.isSafe(jsonUser.password)) {
        return Promise.reject(new CustomBadRequestError("Enter a strong password: minimum of 6 characters, must be alphanumeric!"));
    }

    newUser.setPassword(jsonUser.password);
    return newUser.save();
}

/**
 * Updates the User only if already existing in the database
 */
exports.update = (id, newUserInfoJson) => {
    let fetchUserPromise = userModel.findById(id);
    const updatedUserPromise = fetchUserPromise.then((user) => {
        if (user === null) {
            throw new CustomBadRequestError("The user details supplied are invalid");
        }

        user.firstName = newUserInfoJson.firstName;
        user.lastName = newUserInfoJson.lastName;

        //Checks if the email supplied is null. If not null, the new email has to be unique
        if (newUserInfoJson.email) {
            if (newUserInfoJson.email.localeCompare(user.email) !== 0) {
                user.email = newUserInfoJson.email;
            }
        }

        if (!validate.isGoodPassword(newUserInfoJson.password) || !validate.isLongEnough(newUserInfoJson.password) || !validate.isSafe(newUserInfoJson.password)) {
            throw new CustomBadRequestError("Enter a strong password: minimum of 6 characters, must be alphanumeric!")
        }

        if (newUserInfoJson.password !== null) {
            user.setPassword(newUserInfoJson.password);
        }
        return user.save()
    });
    return updatedUserPromise;
}

/**
 * Fetches the user object model based on the id supplied
 */
exports.get = (id) => {
    const fetchUserPromise = userModel.findById(id).exec();
    return fetchUserPromise;
}

/**
 * Used for the "Forget Password" feature. Generates an OTP for the user and sends an email to the user to reset their password.
 */
exports.recoverPassword = (userInfo) => {
    if (!userInfo.email || Object.keys(userInfo).length > 1) {
        return Promise.reject(new CustomBadRequestError("Please only provide the email for password recovery!"));
    }

    let userEmail = userInfo.email;

    const resetPasswordPromise = userModel.findOne({ email: userEmail }).then(user => {
        if (!user) {
            throw new CustomBadRequestError("No user with the supplied email exists!")
        }

        //Generates and sets the password reset token
        user.generatePasswordReset();

        user.save().then(user => {
            let recoveryToken = user.resetPasswordOTP;
            const recoveryEmail = {
                to: user.email,
                from: process.env.FROM_EMAIL,
                subject: "Password Recovery",
                text: `Hi ${user.firstName} ${user.lastName},\n\nGoDutch got your back.\n\nPlease use the following One Time Password: ${recoveryToken} to reset your password. This will be valid for an hour.\n\nIf you did not request this, please ignore this email.`,
            };

            return sgMail.send(recoveryEmail);
        });
    });

    return resetPasswordPromise;
}

/**
 * Used for the "Forget Password" feature. Takes in the newly supplied password and assigns it to the user
 */
exports.resetPassword = (newPasswordJson) => {
    let resetPasswordToken = newPasswordJson.token;
    let newPassword = newPasswordJson.password;

    if (!newPassword || !resetPasswordToken) {
        throw new CustomBadRequestError("Please supply the OTP and the new Password");
    }

    const updatePasswordPromise = userModel.findOne({ resetPasswordOTP: resetPasswordToken, resetPasswordExpirationTime: { $gt: Date.now() } }).then((user) => {
        if (!user) {
            throw new CustomBadRequestError("The OTP is invalid or has expired!");
        }

        if (newPasswordJson.confirmPassword) {
            if (newPassword.localeCompare(newPasswordJson.confirmPassword) !== 0) {
                throw new CustomBadRequestError("The Password and Confirm Password fields do not match!");
            }
        }

        user.setPassword(newPassword);
        user.resetPasswordOTP = undefined;
        user.resetPasswordExpirationTime = undefined;

        user.save();

        const mailMessage = {
            to: user.email,
            from: process.env.FROM_EMAIL,
            subject: "Password Reset Successful",
            text: `Hi ${user.firstName} ${user.lastName},\n\nGoDutch got your back.\n\nYour password has been changed successfully!`,
        };

        return sgMail.send(mailMessage);
    });

    return updatePasswordPromise;
};

/**
 * Custom Error for Bad Request
 * 
 * @param {} message 
 */
function CustomBadRequestError(message) {
    this.name = "CustomBadRequest";
    this.message = (message || "");
}
CustomBadRequestError.prototype = Error.prototype;