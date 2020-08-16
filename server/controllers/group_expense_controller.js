'use strict';

/**
 * Group Controller 
 * 
 * @author manorath_bajaj
 */
const groupExpenseService = require("./../services/group_expense_service");
// logger
const pino = require('pino');
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

/**
 * Creates a new group Expense and adds createdBy and groupId to the model.
 *
 * @param request
 * @param response
 */
exports.create = (request, response) => {
    const groupExpense = Object.assign({}, request.body);

    groupExpense.sourceGroup = request.params.groupId;
    groupExpense.createdBy = request.payload.id;
    let userId = request.payload.id;
    const result = (savedGroupExpense) => {
        response.status(201);
        response.json(savedGroupExpense);
    }
    
    const promise = groupExpenseService.save(groupExpense,userId);
    promise
        .then(result)
        .catch(renderErrorResponse(response));
}

/** 
 * Update an expense 
 * ONLY CERTAIN FIELDS CAN be updated.
 */
exports.update = (request,response) => {
    const requestJson = Object.assign({},request.body);
    let groupId = request.params.groupId;
    let groupExpenseId = request.params.groupExpenseId;
    let userId = request.payload.id;
    let amount = requestJson.amount;
    let dividePercentage = requestJson.dividePercentage;
    let paidBy = requestJson.paidBy;
    let name = requestJson.name;

    const result = (savedGroupExpense) => {
        if(savedGroupExpense === null) {
            response.json("no expense found by the id " + groupExpenseId);
            response.status(404);
        }
        response.status(200);
        response.json(savedGroupExpense);
    }
    
    const promise = groupExpenseService.update(groupId,groupExpenseId,amount,dividePercentage,paidBy,userId,name);
    promise
        .then(result)
        .catch(renderErrorResponse(response));

}

/**  
 * Delete an expense  
 */
exports.delete = (request,response) => {
    let groupId = request.params.groupId;
    let groupExpenseId = request.params.groupExpenseId;
    let userId = request.payload.id;
    
    const result = (savedGroupExpense) => {
        if(savedGroupExpense === null) {
            response.json("no expense found by the id " + groupExpenseId);
            response.status(404);
        }
        response.status(204);
        response.json("");
    }
    
    const promise = groupExpenseService.delete(groupId,groupExpenseId,userId);
    promise
        .then(result)
        .catch(renderErrorResponse(response));
}

/**
 *  Get a group expense based on its ID.
 */
exports.getGroupExpense = (request,response) => {
    let groupExpenseId = request.params.groupExpenseId;
    logger.info("group expense id is: ", groupExpenseId);
    const result = (savedGroupExpense) => {
        response.status(200);
        if(savedGroupExpense === null )
        {
            response.status(404);
            let message = "no expense found with the id: " + groupExpenseId;
            response.json(message);
        }
        response.status(200);
        response.json(savedGroupExpense);
    }

    const promise = groupExpenseService.fetch(groupExpenseId);
    promise
        .then(result)
        .catch(renderErrorResponse(response));

}

exports.list = (request,response) => {
    let groupId = request.params.groupId;

    const result = (savedGroupExpenses) => {
        response.status(200);
        response.json(savedGroupExpenses);
    }

    const promise = groupExpenseService.findAllExpense(groupId);
    promise
        .then(result)
        .catch(renderErrorResponse(response));
}

/**
 * get amount due for a user.
 *
 * @param request
 * @param response
 */
exports.getUserAmountDue = (request, response) => {
    const result = (amountDueMap) => {
        let obj = {};
        response.status(200);
        amountDueMap.forEach(function(value, key){
            obj[key] = value
        });
        response.json(obj);
    }
    const promise = groupExpenseService.userAmountDue(request.payload.id,request.params.groupId);
    promise
        .then(result)
        .catch(renderErrorResponse(response));
}

/** 
 * Get all the settled balances for the user that is logged in
 */
exports.getAllSettledExpensesPaidByYou = (request,response) => {
    let groupId = request.params.groupId;
    let userId = request.payload.id;

    const result = (savedGroupExpenses) => {
        response.status(200);
        response.json(savedGroupExpenses);
    }

    const promise = groupExpenseService.getAllSettledExpenses(groupId,userId);
    promise
        .then(result)
        .catch(renderErrorResponse(response));
}


/**
 * get amount owed for a user.
 *
 * @param request
 * @param response
 */
exports.getUserAmountOwed = (request, response) => {
    const result = (amountOwedMap) => {
        let obj = {};
        response.status(200);
        amountOwedMap.forEach(function(value, key){
            obj[key] = value
        });
        response.json(obj);
    }
    const promise = groupExpenseService.userAmountOwed(request.payload.id,request.params.groupId);
    promise
        .then(result)
        .catch(renderErrorResponse(response));
}

/**
 *  Get total amount owed or Due for a user 
 */
exports.getUserAmountOwedOrDue = (request, response) => {
    const result = (amountOwedOrDueMap) => {
        let obj = {};
        response.status(200);
        amountOwedOrDueMap.forEach(function(value, key){
            obj[key] = value
        });
        response.json(obj);
    }
    const promise = groupExpenseService.totalAmountOwedOrDue(request.payload.id,request.params.groupId);
    promise
        .then(result)
        .catch(renderErrorResponse(response));
}
/** 
 * Post request to settle a balance 
 */
exports.settleBalanceRequest = (request,response) => {
    logger.debug("here");
    const result = () => {
        response.status = 201;
        response.json("Expense Settled");
    }
    let requestJson = Object.assign({},request.body);
    let userId = request.payload.id;
    let groupId = request.params.groupId;
    let amount = requestJson.amount;
    let toUser = requestJson.toUser;

    const promise = groupExpenseService.settleExpensesWithUser(userId,amount,toUser,groupId);

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
    logger.debug('in error');
    let errorCallback = (error) => {
        if (error) {
            let status = error.status || 500;
            if (error.name === "CastError") {
                error.message = "The ID doesn't exist";
                status = 404;
            }
            if (error.name === "CustomBadRequest") {
                status = 400;
            }
            if (error.name === "CustomUnauthorizedError") {
                status = 401;
            }
            response.status(status);
            response.json({
                message: error.message
            });
        }
    };
    return errorCallback;
};