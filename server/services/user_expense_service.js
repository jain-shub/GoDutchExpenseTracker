'use strict';

//impoorting the model
const mongoose = require('mongoose'),
    userModel = mongoose.model('user'),
    expenseModel = mongoose.model('userExpense');
const pino = require('pino');
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

const dotenv = require('dotenv');
dotenv.config();
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * User Expense Service Module. Expenses between two individual users.
 * 
 * @author rohan_bharti
 */

/**
 * Saves a new Expense to the database, affiliates the to and from user with it as well
 */
exports.save = (userFromId, expenseJson) => {
    const promise = createNewExpense(userFromId, expenseJson);
    return promise;
}

async function createNewExpense(userFromId, expenseJson) {
    let newExpense = new expenseModel();
    newExpense.name = expenseJson.name;
    newExpense.amount = +expenseJson.amount;
    let amountToBePaid = 0;

    let toUserPercentage = +expenseJson.toUserSplitPercentageValue;
    let fromUserPercentage = +expenseJson.fromUserSplitPercentageValue;

    if (fromUserPercentage && toUserPercentage) {
        if (fromUserPercentage + toUserPercentage !== 100) {
            throw new CustomBadRequestError("The percentage split is NOT valid!");
        }
    }

    //check what kind of a split has to be done for the user
    if (expenseJson.type !== undefined || expenseJson.type !== null) {
        newExpense.type = expenseJson.type;

        if (newExpense.type === "CUSTOM") {
            amountToBePaid = percentage(toUserPercentage, newExpense.amount);
            newExpense.toUserSplitPercentageValue = toUserPercentage;
            newExpense.fromUserSplitPercentageValue = fromUserPercentage;
        } else if (newExpense.type === "FULL") {
            amountToBePaid = percentage(100, newExpense.amount);
            newExpense.toUserSplitPercentageValue = 100;
            newExpense.fromUserSplitPercentageValue = 0;
        } else {
            amountToBePaid = percentage(50, newExpense.amount);
            newExpense.toUserSplitPercentageValue = 50;
            newExpense.fromUserSplitPercentageValue = 50;
        }
    }

    //Updating the "FROM" User with the expense and vice-versa
    let fromUserPromise = userModel.findById(userFromId).exec();

    //Updating the "TO" User with the expense and vice-versa
    let toUserEmail = expenseJson.toEmail;
    let toUserPromise = userModel.findOne({ email: toUserEmail }).exec();

    //Updates the users and affiliates the expense objects
    const usersPromise = Promise.all([fromUserPromise, toUserPromise]).then((users) => {
        let fromUser = users[0];
        let toUser = users[1];

        if (fromUser === null || toUser === null) {
            throw new CustomBadRequestError("The user details supplied are invalid");
        }

        let fromUserEmail = fromUser.email;
        let toUserEmail = toUser.email;

        if (fromUserEmail.localeCompare(toUserEmail) == 0) {
            throw new CustomBadRequestError("The from and to user's email cannot be the same for an expense!");
        }

        fromUser.amountOwed += +amountToBePaid;
        fromUser.owedExpenses.push(newExpense);
        fromUser.save();

        toUser.amountDue += +amountToBePaid;
        toUser.dueExpenses.push(newExpense);
        toUser.save();

        newExpense.fromUser = fromUser;
        newExpense.fromUserName = fromUser.firstName + ' ' + fromUser.lastName;
        newExpense.toUser = toUser;
        newExpense.toUserName = toUser.firstName + ' ' + toUser.lastName;
    });

    //Returns the expense save promise
    const saveExpensePromise = usersPromise.then(() => {
        if (newExpense.fromUser === undefined || newExpense.toUser === undefined) {
            throw new CustomBadRequestError("The user details supplied are invalid");
        }

        return newExpense.save();
    });

    return saveExpensePromise;
}

/**
 * Updates the expense with the new information supplied and modifies the new owed and due amounts for the two users involved.
 */
exports.update = (expenseId, newExpenseJson) => {
    let expensePromise = expenseModel.findById(expenseId).exec();

    const updateExpensePromise = expensePromise.then((expense) => {
        expense.name = newExpenseJson.name;

        let amountToBePaid = 0;

        let toUserPercentage = +newExpenseJson.toUserSplitPercentageValue;
        let fromUserPercentage = +newExpenseJson.fromUserSplitPercentageValue;

        if (fromUserPercentage && toUserPercentage) {
            if (fromUserPercentage + toUserPercentage !== 100) {
                throw new CustomBadRequestError("The percentage split is NOT valid!");
            }
        }

        let oldAmountToBePaid = percentage(expense.toUserSplitPercentageValue, expense.amount);

        //check what kind of a new split has to be done for the user
        if (newExpenseJson.type !== undefined || newExpenseJson.type !== null) {
            expense.type = newExpenseJson.type;

            if (expense.type === "CUSTOM") {
                amountToBePaid = percentage(toUserPercentage, newExpenseJson.amount);
                expense.toUserSplitPercentageValue = toUserPercentage;
                expense.fromUserSplitPercentageValue = fromUserPercentage;
            } else if (expense.type === "FULL") {
                amountToBePaid = percentage(100, newExpenseJson.amount);
                expense.toUserSplitPercentageValue = 100;
                expense.fromUserSplitPercentageValue = 0;
            } else {
                amountToBePaid = percentage(50, newExpenseJson.amount);
                expense.toUserSplitPercentageValue = 50;
                expense.fromUserSplitPercentageValue = 50;
            }
        }

        //Updating the expense amount
        expense.amount = +newExpenseJson.amount;

        //Updating the "FROM" User with the new due amount
        let fromUserPromise = userModel.findById(expense.fromUser);
        fromUserPromise.then((user) => {
            if (user === null) {
                throw new CustomBadRequestError("The user details supplied are invalid");
            }
            user.amountOwed += (+amountToBePaid - oldAmountToBePaid);
            user.save()
        });

        //Updating the "TO" User with the new owed amount
        let toUserPromise = userModel.findById(expense.toUser);
        toUserPromise.then((user) => {
            if (user === null) {
                throw new CustomBadRequestError("The user details supplied are invalid");
            }
            user.amountDue += (+amountToBePaid - oldAmountToBePaid);
            user.save();
        });

        return expense.save();
    });

    return updateExpensePromise;
}

/**
 * Gets the User Expense Object based on the ID supplied, provided the user who created it has access to it
 */
exports.fetch = (expenseId) => {
    const fetchExpensePromise = expenseModel.findById(expenseId).exec();
    return fetchExpensePromise;
}

/**
 * Gets all the User Expense Objects based on the User ID supplied, combines both the due and the owed Expenses
 */
exports.fetchAll = (userId) => {
    const fetchUserPromise = userModel.findById(userId).exec();
    let fetchAllExpensePromise = [];
    let finalPromise;

    const fetchExpensesPromise = fetchUserPromise.then((user) => {
        let dueExpensesIds = user.dueExpenses;
        let owedExpensesIds = user.owedExpenses;

        if (dueExpensesIds.length > 0) {
            for (let i = 0; i < dueExpensesIds.length; i++) {
                let promise = this.fetch(dueExpensesIds[i]);
                fetchAllExpensePromise.push(promise);
            }
        }

        if (owedExpensesIds.length > 0) {
            for (let i = 0; i < owedExpensesIds.length; i++) {
                let promise = this.fetch(owedExpensesIds[i]);
                fetchAllExpensePromise.push(promise);
            }
        }
    });

    const combineAllFetchedExpensesPromise = fetchExpensesPromise.then(() => {
        return Promise.all(fetchAllExpensePromise).then((expenses) => {
            finalPromise = new Promise(function (resolve, reject) {
                resolve(expenses);
            });

            return finalPromise;
        });
    });

    return combineAllFetchedExpensesPromise;
}

/**
 * Deletes the User Expense Object based on the ID supplied, provided the user who created it has access to it
 */
exports.delete = (expenseId) => {
    const fetchExpensePromise = expenseModel.findById(expenseId).exec();

    const updateUserPromise = fetchExpensePromise.then((expense) => {
        if (!expense) {
            throw new CustomBadRequestError("The expense ID supplied is invalid");
        }

        let fromUserPromise = userModel.findById(expense.fromUser);
        let toUserPromise = userModel.findById(expense.toUser);

        Promise.all([fromUserPromise, toUserPromise]).then((users) => {
            let fromUser = users[0];
            let toUser = users[1];

            if (fromUser === null || toUser === null) {
                throw new CustomBadRequestError("The user details supplied are invalid");
            }

            let fromUserAmountOwed = percentage(expense.toUserSplitPercentageValue, expense.amount);
            fromUser.amountOwed -= fromUserAmountOwed;
            let fromUserToBeRemovedIndex = fromUser.owedExpenses.indexOf(expense._id);
            if (fromUserToBeRemovedIndex > -1) {
                fromUser.owedExpenses.splice(fromUserToBeRemovedIndex, 1);
            }
            fromUser.save();

            let toUserAmountDue = percentage(expense.toUserSplitPercentageValue, expense.amount);
            toUser.amountDue -= toUserAmountDue;
            let toUserToBeRemovedIndex = toUser.dueExpenses.indexOf(expense._id);
            if (toUserToBeRemovedIndex > -1) {
                toUser.dueExpenses.splice(toUserToBeRemovedIndex, 1);
            }
            toUser.save();
        });
    });

    const deleteExpensePromise = updateUserPromise.then(() => {
        return expenseModel.findByIdAndDelete(expenseId).exec();
    })

    return deleteExpensePromise;
}

/**
 * Function for sending an email to the users involved in the newly created expense 
 * 
 * @param {*} user 
 */
exports.sendExpenseCreationEmail = (expense) => {
    let fromUserEmail = expense.fromUser.email;
    let toUserEmail = expense.toUser.email;

    if (fromUserEmail) {
        const amountOwed = percentage(expense.toUserSplitPercentageValue, expense.amount);
        const fromUserMsg = {
            to: fromUserEmail,
            from: process.env.FROM_EMAIL,
            subject: 'New Expense',
            text: `Hi ${expense.fromUser.firstName} ${expense.fromUser.lastName},\n\nLet's talk money!\n\nYou are owed by your friend ${expense.toUser.firstName} ${expense.toUser.lastName} ${amountOwed}$ for ${expense.name} Expense!`,
        };
        sgMail.send(fromUserMsg).catch((error) => {
            console.log(error.message);
        });
    }

    if (toUserEmail) {
        const amountOwed = percentage(expense.toUserSplitPercentageValue, expense.amount);
        const fromUserMsg = {
            to: toUserEmail,
            from: process.env.FROM_EMAIL,
            subject: 'New Expense',
            text: `Hi ${expense.toUser.firstName} ${expense.toUser.lastName},\n\nLet's talk money!\n\nYou owe your friend ${expense.fromUser.firstName} ${expense.toUser.fromName} ${amountOwed}$ for ${expense.name} Expense!`,
        };
        sgMail.send(fromUserMsg).catch((error) => {
            console.log(error.message);
        });
    }
};

//Helper function to calculate the percentage
function percentage(percent, total) {
    return ((percent / 100) * total).toFixed(2);
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