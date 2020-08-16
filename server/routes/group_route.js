'use strict';

/**
 * Group Route module to define the valid endpoints for the Groups.
 * 
 * @author manorath_bajaj
 */

const groupController = require('../controllers/group_controller');
const auth = require("../services/auth");

module.exports = (app) => {
     app.route('/v1/groups')
        .post(auth.required,groupController.create)
        .get(auth.required,groupController.list);
     app.route('/v1/groups/:groupId')
        .get(auth.required,groupController.fetch)
        .put(auth.required,groupController.update)
        .delete(auth.required,groupController.delete); 
 }

