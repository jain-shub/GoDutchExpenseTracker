'use strict';

/**
 * Accout Route module to define the valid endpoints for the User's Account
 *
 * @author rohan_bharti
 */

const accountController = require('../controllers/account_controller');
const auth = require("../services/auth");

module.exports = (app) => {
    app.route('/v1/accounts')
        .post(auth.required, accountController.create)
        .get(auth.required, accountController.fetchAll);

    app.route('/v1/accounts/:id')
        .delete(auth.required, accountController.delete);

    app.route('/v1/accounts/:id/transactions/:daysNum')
        .get(auth.required, accountController.fetchTransactions);

    //Handles the Error for the JWT Middleware
    app.use(function (err, req, res, next) {
        if (err.name === 'UnauthorizedError') {
            res.status(err.status).send({ message: err.message });
            return;
        }
        next();
    });
};