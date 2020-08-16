'use strict';

const mongoose = require('mongoose');
const userModel = mongoose.model('user');
const Schema = mongoose.Schema;

/**
 * Mongoose schema for User Expense object.
 * 
 * @author rohan_bharti
 */

let userExpenseSchema = new Schema({
    fromUser: {
        type: Schema.Types.ObjectId,
        description: "The user who paid initially and is creating the expense, will take money from toUser",
        ref: "user"
    },
    toUser: {
        type: Schema.Types.ObjectId,
        description: "The user for whom the expense is for and has to pay the fromUser",
        ref: "user"
    },
    fromUserName: {
        type: String,
        description: "Name of From User."
    },
    toUserName: {
        type: String,
        description: "Name of To User."
    },
    name: {
        type: String,
        required: "Name for the Expense is required."
    },
    amount: {
        type: Number,
        required: "Amount for the Expense is required."
    },
    type: {
        type: String,
        enum: ['FULL', 'SPLIT', 'CUSTOM'],
        default: 'SPLIT',
        required: "Distribution Type for the Expense is required."
    },
    fromUserSplitPercentageValue: {
        type: Number,
        default: 50.0,
        required: "From User Split Percentage Value for the Expense is required."
    },
    toUserSplitPercentageValue: {
        type: Number,
        default: 50.0,
        required: "To User Split Percentage Value for the Expense is required."
    }
},
    {
        timestamps: true,
        versionKey: false
    });

/**
 * Constructs the response for the Expense Object based on what type of operation is being performe on it.
 */
userExpenseSchema.methods.toExpenseJson = function () {
    if ((this.fromUser instanceof userModel) && (this.toUser instanceof userModel)) {
        return {
            id: this.id,
            fromUser: this.fromUser.userModelJSON(),
            toUser: this.toUser.userModelJSON(),
            name: this.name,
            amount: this.amount,
            type: this.type,
            fromUserSplitPercentageValue: this.fromUserSplitPercentageValue,
            toUserSplitPercentageValue: this.toUserSplitPercentageValue,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    } else {
        return {
            id: this.id,
            fromUser: this.fromUser,
            fromUserName: this.fromUserName,
            toUser: this.toUser,
            toUserName: this.toUserName,
            name: this.name,
            amount: this.amount,
            type: this.type,
            fromUserSplitPercentageValue: this.fromUserSplitPercentageValue,
            toUserSplitPercentageValue: this.toUserSplitPercentageValue,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

/**
 * Duplicate the id field as mongoose returns _id field instead of id
 */
userExpenseSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

/**
 * Ensure virtual fields are serialised (for id in this case)
 */
userExpenseSchema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('userExpense', userExpenseSchema);