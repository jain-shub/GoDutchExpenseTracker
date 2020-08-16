'use strict';

const userRoute = require('./user_route');
const userExpenseRoute = require('./user_expense_route');
const groupRoute = require('./group_route');
const groupExpenseRoute = require('./group_expense_route');
const accountRoute = require('./account_route');

module.exports = (app) => {
    userRoute(app);
    userExpenseRoute(app);
    groupRoute(app);
    groupExpenseRoute(app);
    accountRoute(app);
}