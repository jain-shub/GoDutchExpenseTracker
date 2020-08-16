'use strict';

//impoorting the model
const mongoose = require('mongoose'),
    accountModel = mongoose.model('account');

const plaidClient = require('../services/plaid');
const pino = require('pino');
const dotenv = require('dotenv');
dotenv.config();
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const logger = pino({ level: process.env.LOG_LEVEL || 'info', prettyPrint: { colorize: true } });
const moment = require("moment");

/**
 * Account Service
 *
 * @author rohan_bharti
 */

/**
* Saves a new Account to the database with proper validation. Creates an Access Token for the account to fetch its information.
*/
exports.save = (publicToken, userId, institution) => {
    let newAccount = new accountModel();
    let { name, institution_id } = institution;
    let accessToken;
    let itemId;

    if (publicToken) {
        return plaidClient.exchangePublicToken(publicToken).then(result => {
            accessToken = result.access_token;
            itemId = result.item_id;

            return accountModel.findOne({
                user: userId,
                institutionId: institution_id
            }).then((account) => {
                if (account) {
                    logger.info("Account already exists");
                    throw new CustomBadRequestError("Account already exists");
                } else {
                    newAccount.user = userId;
                    newAccount.accessToken = accessToken;
                    newAccount.itemId = itemId;
                    newAccount.institutionId = institution_id;
                    newAccount.institutionName = name;
                    return newAccount.save();
                }
            });
        });
    }
}

/**
 * Fetches the accounts for the user and returns the promise
 * 
 * @param {*} message 
 */
exports.fetchAll = (userId) => {
    return accountModel.find({ user: userId }).exec();
}

/**
 * Verifies the user credentials for the account Id supplied and deletes the Account
 * 
 * @param {*} message 
 */
exports.delete = (accountId, userId) => {
    const verifyAccountUserAndDeletePromise = accountModel.findById(accountId).then(account => {
        return account.remove();
    });
    return verifyAccountUserAndDeletePromise;
}

/**
 * Fetches the transactions for the account Id supplied
 */
exports.fetchAccountTransactions = (userId, accountId, daysNum) => {
    let now = moment();
    let today = now.format("YYYY-MM-DD");
    let userSuppliedDaysAgo = now.subtract(+daysNum, "days").format("YYYY-MM-DD");

    let customTransactionsArray = [];

    const fetchTransactionsPromise = accountModel.findById(accountId).then((account) => {
        if (account) {
            let accountuserId = account.user.toString();
            if (accountuserId.localeCompare(userId) !== 0) {
                throw new CustomBadRequestError("Account does not belong to the current user logged in!");
            }
            let accessToken = account.accessToken;
            return plaidClient.getTransactions(accessToken, userSuppliedDaysAgo, today).then((response) => {
                let responseTransactionsArray = response.transactions;
                for (let i = 0; i < responseTransactionsArray.length; i++) {
                    customTransactionsArray.push({
                        "account": responseTransactionsArray[i]["account_id"],
                        "date": responseTransactionsArray[i]["date"],
                        "name": responseTransactionsArray[i]["name"],
                        "amount": responseTransactionsArray[i]["amount"],
                        "category": responseTransactionsArray[i]["category"][0]
                    });
                }
            }).then(() => {
                return Promise.resolve(customTransactionsArray);
            })
        } else {
            throw new CustomBadRequestError("The account doesn't exist");
        }
    });

    return fetchTransactionsPromise;
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