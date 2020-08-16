'use strict';

/**
 * Account Controller
 *
 * @author rohan_bharti
 */

const accountService = require("./../services/account_service");

/**
 * Creates a new Accout for the User
 *
 * @param request
 * @param response
 */
exports.create = (request, response) => {
    const publicToken = request.body.publicToken;
    const userId = request.payload.id;
    const institution = request.body.institution;
    const result = (savedAccount) => {
        response.status(201);
        response.json(savedAccount.accountModelJSON());
    }
    const promise = accountService.save(publicToken, userId, institution);
    promise
        .then(result)
        .catch(renderErrorResponse(response));
}

/**
 * Fetches all the accounts for the user
 * 
 * @param request
 * @param response
 */
exports.fetchAll = (request, response) => {
    const userId = request.payload.id;
    const result = (accounts) => {
        response.status(200);
        response.json(accounts);
    }
    const promise = accountService.fetchAll(userId);
    promise
        .then(result)
        .catch(renderErrorResponse(response));
}

/**
 * Deletes the account with the ID supplied
 * 
 * @param request
 * @param response
 */
exports.delete = (request, response) => {
    const accountId = request.params.id;
    const userId = request.payload.id;
    const result = () => {
        response.status(200);
        response.json("Successfully deleted the Account!");
    }
    const promise = accountService.delete(accountId, userId);
    promise
        .then(result)
        .catch(renderErrorResponse(response));
}

/**
 * Takes in the account Id and fetches the transactions for that account
 * 
 * @param request
 * @param response
 */
exports.fetchTransactions = (request, response) => {
    const accountId = request.params.id;
    const userId = request.payload.id;
    const daysNum = request.params.daysNum;
    const result = (transactions) => {
        response.status(200);
        response.json(transactions);
    }
    const promise = accountService.fetchAccountTransactions(userId, accountId, daysNum);
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
            if (error.name === "PlaidError") {
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