'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

/**
 * Mongoose schema for Account object.
 * 
 * @author rohan_bharti
 */

const accountSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    accessToken: {
        type: String,
        description: "A unique token generated valid for 30 minutes for an account sign in",
        required: true
    },
    itemId: {
        type: String,
        description: "A unique ID for the account",
        required: true
    },
    institutionId: {
        type: String,
        description: "A unique ID for the institution",
        required: true
    },
    institutionName: {
        type: String,
        description: "Name of the institution",
    },
    accountName: {
        type: String
    },
    accountType: {
        type: String
    },
    accountSubtype: {
        type: String
    }
},
    {
        versionKey: false
    });

/**
 * Used to return specified user account’s properties
 */
accountSchema.methods.accountModelJSON = function () {
    return {
        id: this.id,
        userId: this.user,
        itemId: this.itemId,
        institutionId: this.institutionId,
        institutionName: this.institutionName,
        accessToken: this.accessToken
    };
}

module.exports = mongoose.model('account', accountSchema);