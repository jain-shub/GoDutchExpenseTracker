'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

/**
 * Mongoose schema for User object.
 * 
 * @author rohan_bharti
 */

let userSchema = new Schema({
    firstName: {
        type: String,
        required: "Title is required."
    },
    lastName: {
        type: String,
        required: "Description is required."
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email Address can't be blank."],
        match: [/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'The enail entered is invalid'],
        index: true
    },
    dueExpenses: [{
        type: Schema.Types.ObjectId,
        ref: "userExpense"
    }],
    owedExpenses: [{
        type: Schema.Types.ObjectId,
        ref: "userExpense"
    }],
    amountDue: {
        type: Number,
        default: 0.0
    },
    amountOwed: {
        type: Number,
        default: 0.0
    },
    salt: {
        type: String
    },
    hash: {
        type: String
    },
    resetPasswordOTP: {
        type: String,
        required: false
    },
    resetPasswordExpirationTime: {
        type: Date,
        required: false
    }
},
    {
        timestamps: true,
        versionKey: false
    });

/**
 * Pre-save validation for all the unique fields
 */
userSchema.plugin(uniqueValidator, { message: "is already taken." });

/**
 * Encrypts the password by generating a random hash and salt using tyhe Crypto library
 */
userSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

/**
 * Used to compare the provided password with the users’ actual password
 */
userSchema.methods.checkPasswordValidity = function (password) {
    let hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

/**
 * Creates a JSON Web Token that expires 60 days from creation, stored and used in the Frontend’s localStorage
 */
userSchema.methods.generateJWT = function () {
    let today = new Date();
    let exp = new Date(today);
    exp.setDate(today.getDate() + 60);
    return jwt.sign({
        id: this._id,
        email: this.email,
        exp: parseInt(exp.getTime() / 1000)
    }, 'secret')
};

/**
 * Used for resetting the password for the user
 */
userSchema.methods.generatePasswordReset = function () {
    this.resetPasswordOTP = Math.floor(100000 + Math.random() * 900000);
    this.resetPasswordExpirationTime = Date.now() + 3600000;
};

/**
 * Used to return specified user’s properties while logging in and attach a token to it
 */
userSchema.methods.toAuthJSON = function () {
    return {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        jwtToken: this.generateJWT()
    };
};

/**
 * Used to return specified user’s properties while creating an account
 */
userSchema.methods.userModelJSON = function () {
    return {
        id: this.id,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        amountDue: this.amountDue,
        amountOwed: this.amountOwed,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
    };
}

/**
 * Duplicate the id field as mongoose returns _id field instead of id
 */
userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

/**
 * Ensure virtual fields are serialised (for id in this case)
 */
userSchema.set('toJSON', {
    virtuals: true,
    transform: function(doc, ret, options) {
        delete ret.dueExpenses;
        delete ret.owedExpenses;
        delete ret.amountDue;
        delete ret.amountOwed;
        delete ret.hash;
        delete ret.salt;
        delete ret.resetPasswordOTP;
        delete ret.resetPasswordExpirationTime;
        delete ret._id;
        delete ret.createdAt;
        delete ret.updatedAt;
        return ret;
    }
});

module.exports = mongoose.model('user', userSchema);