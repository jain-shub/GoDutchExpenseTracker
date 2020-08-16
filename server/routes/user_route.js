'use strict';

/**
 * User Route module to define the valid endpoints for the User
 * 
 * @author rohan_bharti
 */

const userController = require('../controllers/user_controller');
const auth = require("../services/auth");

module.exports = (app) => {
    app.route('/v1/user')
        .post(auth.optional, userController.create)
        .get(auth.required, userController.fetch)
        .put(auth.required, userController.update);

    app.route('/v1/login')
        .post(auth.optional, userController.login);

    app.route('/v1/recover')
        .post(auth.optional, userController.recoverPassword);

    app.route('/v1/reset')
        .post(auth.optional, userController.resetPassword);

    //Handles the Error for the JWT Middleware
    app.use(function (err, req, res, next) {
        if (err.name === 'UnauthorizedError') {
            res.status(err.status).send({ message: err.message });
            return;
        }
        next();
    });
};