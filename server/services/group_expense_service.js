'use strict';

//importing the model
const mongoose = require('mongoose'),
    userModel = mongoose.model('user'),
    groupExpenseModel = mongoose.model('groupExpense'),
    groupModel = mongoose.model('group');
    
const pino = require('pino');
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

/**
 * User Expense Service Module. Expenses between two individual users.
 * 
 * @author manorath_bajaj
 */

 /** 
  * Save the Expense
  */
exports.save = (groupExpense,userId) => {
    let groupPromise = groupModel.findById(groupExpense.sourceGroup).exec();
    console.log("in service");   
    return groupPromise.then((group)=> {
        if (group === null) {
            throw new CustomBadRequestError("Group with id " + groupID +"does not exit");
        }
        else {
            if(!group.members.includes(mongoose.Types.ObjectId(userId))) {
                throw new CustomUnauthorizedError("User with userID " + userId +"is not a part of the group");
            }
            else{
                let newGroupExpense = new groupExpenseModel(groupExpense);
                 return newGroupExpense.save();
            }
        }
    });
    
    
    
}

/**
 *  Update a group Expense list 
 */
exports.update = (groupId,groupExpenseID,newAmount,newDividePercentage,newPaidBy,userId,newName)=> {
    let groupPromise = groupModel.findById(groupId).exec();
    console.log("in service");   
    return groupPromise.then((group)=> {
        let flag = 0;
        if (group === null) {
            throw new CustomBadRequestError("Group with id " + groupID +"does not exit");
        }
        else {
            if(!group.members.includes(mongoose.Types.ObjectId(userId))) {
                throw new CustomUnauthorizedError("User with userID " + userId +"is not a part of the group");
            }
            else{
                const filter = {_id: groupExpenseID};
                const update = {amount:newAmount,dividePercentage :newDividePercentage,paidBy:newPaidBy,name:newName};
                return groupExpenseModel.findOneAndUpdate(filter,update,{ 
                    new:true
                }).exec();
            }
        }
    });

}

/** Delete a group expense */
exports.delete = (groupId,groupExpenseID,userId) => {
    let groupPromise = groupModel.findById(groupId).exec();
    console.log("in service");   
    return groupPromise.then((group)=> {
        let flag = 0;
        if (group === null) {
            throw new CustomBadRequestError("Group with id " + groupID +"does not exit");
        }
        else {
            if(!group.members.includes(mongoose.Types.ObjectId(userId))) {
                throw new CustomUnauthorizedError("User with userID " + userId +"is not a part of the group");
            }
            else{
                return groupExpenseModel.findByIdAndDelete(groupExpenseID).exec();
            }
        }
    });
} 

/**
 *  get a Group expense
 */
exports.fetch = (groupExpenseID) => {
    let promise = groupExpenseModel.findById(groupExpenseID).exec()
    .catch((error) => {
        console.log("Error at fetch from database: ",error);
    });
    return promise;
}

/** Get a list of userExpenses for a group id */
exports.findAllExpense = (groupID) => {
    let groupPromise = groupModel.findById(groupID).exec();
    console.log("in service");
    
    return groupPromise.then((group)=> {
        if (group === null) {
            throw new CustomBadRequestError("Group with id " + groupID +"does not exit");
        }
        else{
            // only supposed to return expenses and not settled expenses
            return groupExpenseModel.find({sourceGroup:groupID,isSettle:false}).exec();
        }  
    });
}

/** 
 * get a list of all settled expenses paid by you 
 */
exports.getAllSettledExpenses = (groupID,userId) => {
    let groupPromise = groupModel.findById(groupID).exec();
    console.log("in service");   
    return groupPromise.then((group)=> {
        let flag = 0;
        if (group === null) {
            throw new CustomBadRequestError("Group with id " + groupID +"does not exit");
        }
        else {
            if(!group.members.includes(mongoose.Types.ObjectId(userId))) {
                throw new CustomUnauthorizedError("User with userID " + userId +"is not a part of the group");
            }
            else{
                return groupExpenseModel.find({sourceGroup:groupID,isSettle:true,paidBy:userId}).exec();
            }
        }
    });
}

/**
 *  Get amount due for a user
 */
exports.userAmountDue = (userID,groupID) => {
    // get all groupExpenses for the group
    let amountDue = 0;
    let dueTo = new Map();
    
    let promise = groupExpenseModel.find({sourceGroup:groupID}).exec();
    return promise.then((expenses) => {
        expenses.forEach( expense => {
            logger.debug("userID: ",userID);
            logger.debug(expense.dividePercentage);
            logger.debug(expense.dividePercentage.has(userID));
            if(expense.paidBy.toHexString() != userID && expense.dividePercentage.has(userID)) {
                let amountPart = (expense.amount * expense.dividePercentage.get(userID));
                amountDue = amountDue + amountPart;
                if(dueTo.has(expense.paidBy.toHexString())){
                    logger.debug("in already made");
                    dueTo.set(expense.paidBy.toHexString(), dueTo.get(expense.paidBy.toHexString()) + amountPart);
                }
                else{
                     logger.debug("in newly made");
                    dueTo.set(expense.paidBy.toHexString(),amountPart);
                }
            }
        });
    }).then((result) => {
            dueTo.set("totalDue",amountDue);
            logger.info("dueTo Map: amount due" + dueTo.get("totalDue"));
            return dueTo;
    });
}

/**
 *  Get amount owed for a user
 */
exports.userAmountOwed = (userID,groupID) => {
    // get all groupExpenses for the group
    let amountOwed = 0;
    let OwedBy = new Map();
    
    let promise = groupExpenseModel.find({sourceGroup:groupID}).exec();
    return promise.then((expenses) => {
        expenses.forEach( expense => {
            logger.debug(expense.dividePercentage);
            logger.debug(expense.dividePercentage.has(userID));
            logger.debug(!expense.paidBy.toHexString() === userID);
            if(expense.paidBy.toHexString() === userID) {
                logger.debug("userID: ",userID);
                let amountPart = (expense.amount - (expense.amount * expense.dividePercentage.get(userID)));
                amountOwed = amountOwed + amountPart;
                let userExpense;
                expense.dividePercentage.forEach(function(value, key) {
                    if(key !== userID) {
                        userExpense = expense.amount * value;
                        if(OwedBy.has(key)) {
                            OwedBy.set(key,OwedBy.get(key) + userExpense);
                        }
                        else {
                            OwedBy.set(key,userExpense);
                        }
                    }
                }); 
                // Reference for the future for BUGFIX.    
                // if(OwedBy.has(expense.paidBy.toHexString())){
                //     console.log("in already made");
                //     OwedBy.set(expense.paidBy.toHexString(), OwedBy.get(expense.paidBy.toHexString()) + amountPart);
                // }
                // else{
                //     console.log("in newly made");
                //     OwedBy.set(expense.paidBy.toHexString(),amountPart);
                // }
            }
        });
    }).then((result) => {
            OwedBy.set("totalOwed",amountOwed);
            console.log("dueTo Map: amount due" + OwedBy.get("totalOwed"));
            return OwedBy;
    });
}

/** Get total amount(Owed or due for user) */
exports.totalAmountOwedOrDue = (userId,groupId) => {
    let duePromise = this.userAmountDue(userId,groupId);
    let owedPromise = this.userAmountOwed(userId,groupId);
    let totalMap = new Map();
    let dueMap,owedMap;
    return Promise.all([duePromise,owedPromise]).then((resultMaps) => {
        console.log("mapSize: " ,resultMaps.length);
        dueMap = resultMaps[0];
        owedMap = resultMaps[1];
        
        // this is supposed to check if total map has already the compared cost and add it to total map
        // TODO: check to see if the second part of the if statements are redundant. I feel they are but better safe than sorry.
        owedMap.forEach(function (value,key){
            if(dueMap.has(key) && !totalMap.has(key)) {
                totalMap.set(key,owedMap.get(key)-dueMap.get(key));
            }
            else if(!dueMap.has(key) && !totalMap.has(key)) {
                totalMap.set(key,owedMap.get(value));
            }
        });

        // same loop for Due maps to get while checking total maps
        dueMap.forEach(function (value,key){
            // add the values that were not present in owedMap.
            if(!owedMap.has(key) && !totalMap.has(key)  && key!=="totalDue") {
                totalMap.set(key,-1*value);
            }
        });
        
    }).then((result) => {
        totalMap.set("total",owedMap.get("totalOwed") - dueMap.get("totalDue"));
        console.log("totalMap Map: amount due" + totalMap.get("total"));
        return totalMap;
    });
}

/** 
 * Make a Settle expense call to settle group users.
 */
exports.settleExpensesWithUser= (userId,amount,toUser,groupId) => {
    
        let groupExpense = new groupExpenseModel();
        groupExpense.name = "settledExpense";
    
    // TODO: Add validation after proof of concept here.
    // Add validation to check user id's exist and entered amount is valid, and less than the  total amount due.
        groupExpense.paidBy = userId;
        groupExpense.createdBy = userId;
    try{
        groupExpense.dividePercentage = new Map();
        groupExpense.dividePercentage.set(userId,0);
        groupExpense.dividePercentage.set(toUser,1);
        } catch(err) {
            console.log(err);
        };
    console.log("in service");
    groupExpense.isSettle = true;
    groupExpense.sourceGroup = groupId;
    groupExpense.amount = amount;
    console.log("before logging object");
    console.log(groupExpense.toJSON());
   
    return groupExpense.save();
}

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

/**
 * Custom Error for Unauthorised Request
 * 
 * @param {} message 
 */
function CustomUnauthorizedError(message) {
    this.name = "CustomUnauthorizedError";
    this.message = (message || "");
}
CustomUnauthorizedError.prototype = Error.prototype;



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