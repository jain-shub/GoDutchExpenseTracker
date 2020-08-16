'use strict';

/**
 * Expense Controller 
 * 
 * @author rohan_bharti
 */

const userExpenseService = require("./../services/user_expense_service");

/**
 * Creates a new expense between two individual users.
 */
exports.create = (request, response) => {
    const userFromId = request.payload.id;
    const expenseJson = Object.assign({}, request.body);
    const result = (expense) => {
        userExpenseService.sendExpenseCreationEmail(expense);
        response.status(201);
        response.json(expense.toExpenseJson());
    }
    const promise = userExpenseService.save(userFromId, expenseJson);
    promise
        .then(result)
        .catch(renderErrorResponse(response));
}

/**
 * Updates the expense between two users once the user who created it is authenticated.
 */
exports.update = (request, response) => {
    const newExpenseJson = Object.assign({}, request.body);
    const expenseId = request.params.id;
    const result = (updatedExpense) => {
        response.status(200);
        response.json(updatedExpense.toExpenseJson());
    }
    const promise = userExpenseService.update(expenseId, newExpenseJson);
    promise
        .then(result)
        .catch(renderErrorResponse(response));
}

/**
 * Gets the expense between two users once the user who created it is authenticated.
 */
exports.fetch = (request, response) => {
    const expenseId = request.params.id;
    const result = (fetchedExpense) => {
        response.status(200);
        response.json(fetchedExpense.toExpenseJson());
    }
    const promise = userExpenseService.fetch(expenseId);
    promise
        .then(result)
        .catch(renderErrorResponse(response));
}

/**
 * Gets all the expenses due and owed for the user logged in and authenticated.
 */
exports.fetchAll = (request, response) => {
    const userId = request.payload.id;
    const result = (fetchedExpenses) => {
        response.status(200);
        response.json(fetchedExpenses);
    }
    const promise = userExpenseService.fetchAll(userId);
    promise
        .then(result)
        .catch(renderErrorResponse(response));
}

/**
 * Deletes the expense between two users once the user who created it is authenticated.
 */
exports.delete = (request, response) => {
    const expenseId = request.params.id;
    const result = () => {
        response.status(200);
        response.json("Successfully Deleted the Expense!");
    }
    const promise = userExpenseService.delete(expenseId);
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
