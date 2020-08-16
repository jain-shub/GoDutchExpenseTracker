'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userModel = mongoose.model('user'); 

/**
 * Mongoose schema for Group object.
 * 
 * @author manorath_bajaj
 */

 let groupSchema = new Schema({
    name: {
        type: String,
        required: "Group Name is required"
    },
    groupType: {
        // TODO: decide on ENUM types for group type.
        type : String,
        enum: ['DEFAULT'],
        required: "Group type is required"
    },
    balance: {
        // TODO: decide on expense model and use that to calculate group balance.
        Type: Number,
        default: 0.00,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "user",
        require: "User who created the group is required"
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: "user"
    }],
    },
    {
        timestamps: true,
        versionKey: false
    });

 /**
 * Duplicate the id field as mongoose returns _id field instead of id
 */
groupSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

/**
 * Ensure virtual fields are serialised (for id in this case)
 */
groupSchema.set('toJSON', {
    virtuals: true
});

groupSchema.methods.groupModelJson = function () {
    return {
        id: this.id,
        members: this.members.array.forEach(element => {
            element.userModelJSON();
        }),
        createdBy: this.createdBy.userModelJSON()
    };
}

module.exports = mongoose.model('group', groupSchema);
