'use strict';

/**
 * User Expense Route module to define the valid endpoints for the User
 * 
 * @author rohan_bharti
 */

const userExpenseController = require('../controllers/user_expense_controller');
const auth = require("../services/auth");

module.exports = (app) => {
    app.route('/v1/expense')
        .post(auth.required, userExpenseController.create)
        .get(auth.required, userExpenseController.fetchAll);

    app.route('/v1/expense/:id')
        .put(auth.required, userExpenseController.update)
        .get(auth.required, userExpenseController.fetch)
        .delete(auth.required, userExpenseController.delete);

    //Handles the Error for the JWT Middleware
    app.use(function (err, req, res, next) {
        if (err.name === 'UnauthorizedError') {
            res.status(err.status).send({ message: err.message });
            return;
        }
        next();
    });
};