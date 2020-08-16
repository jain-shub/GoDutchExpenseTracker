'use strict';

/**
 * Group Expense Route module to define the valid endpoints for the Group Expenses
 * 
 * @author manorath_bajaj
 */

const groupExpenseController = require('../controllers/group_expense_controller');
const auth = require("../services/auth");

module.exports = (app) => {
    app.route('/v1/:groupId/expenses')
        .post(auth.required, groupExpenseController.create)
        .get(auth.required,groupExpenseController.list);
    
    app.route('/v1/:groupId/expenses/settle')
        .post(auth.required,groupExpenseController.settleBalanceRequest)
        .get(auth.required,groupExpenseController.getAllSettledExpensesPaidByYou);
    
    app.route('/v1/:groupId/expense/:groupExpenseId')
        .get(auth.required, groupExpenseController.getGroupExpense)
        .put(auth.required,groupExpenseController.update)
        .delete(auth.required,groupExpenseController.delete);
    
    
    // Inactive atm, may have a connection is future for analytics.    
    
    app.route('/v1/:groupId/expenses/due')
        .get(auth.required, groupExpenseController.getUserAmountDue);
    // Inactive atm, may have a connection is future for analytics.    
    
    app.route('/v1/:groupId/expenses/owed')
        .get(auth.required, groupExpenseController.getUserAmountOwed);
    
    app.route('/v1/:groupId/expenses/total')
        .get(auth.required, groupExpenseController.getUserAmountOwedOrDue);
    

        //Handles the Error for the JWT Middleware
    app.use(function (err, req, res, next) {
        if (err.name === 'UnauthorizedError') {
            res.status(err.status).send({ message: err.message });
            return;
        }
        next();
    });
};