'use strict';

const mongoose = require('mongoose');
const userModel = mongoose.model('user');
const groupModel = mongoose.model('group');
const Schema = mongoose.Schema;

/**
 * Mongoose schema for Group Expense object.
 * 
 * @author manorath_bajaj
 */
let groupExpenseSchema = new Schema({
    name:{
        type : String,
        description: "name of the ExpenseBill",
        required: "Name is required"
    },
    sourceGroup: {
        type: Schema.Types.ObjectId,
        description: "Source group to which the expense belongs to",
        ref: "group"
    },
    amount : {
        type: Number,
        description: "Total amount of the expense",
    },
    dividePercentage : {
        type : Map,
        of: Number,
        description : "a number between 0 and 1 that signifies the percentage"
    },
    paidBy : {
        type: Schema.Types.ObjectId,
        description: "Bill paid by user",
        ref: "user",
        required: "paidBy user is required"
    },
    createdBy : {
        type: Schema.Types.ObjectId,
        description: "Bill created by user",
        ref: "user"
    },
    isSettle: {
        type: Boolean,
        description: "indicates if the expense is used to settle up",
        default: false
    }
},
    {
        timestamps: true,
        versionKey: false
    }
);



/**
 * Duplicate the id field as mongoose returns _id field instead of id
 */
groupExpenseSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

/**
 * Ensure virtual fields are serialised (for id in this case)
 */
groupExpenseSchema.set('toJSON', {
    virtuals: true
});



module.exports = mongoose.model('groupExpense', groupExpenseSchema);
