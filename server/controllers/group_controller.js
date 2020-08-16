'use strict';

/**
 * Group Controller 
 * 
 * @author manorath_bajaj
 */
const groupService = require("./../services/group_service");
// logger
const pino = require('pino');
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });


/**
 * Creates a new group and using the user id from session.
 *
 * @param request
 * @param response
 */
exports.create = (request, response) => {
    const group = Object.assign({}, request.body);

    const result = (savedGroup) => {
        response.status(201);
        response.json(savedGroup);
    }
    
    const promise = groupService.save(group,request.payload.id);
    promise
        .then(result)
        .catch(renderErrorResponse(response));
}
/** 
 * Get a Group object based on id 
*/
exports.fetch = (request,response) => {
    const id = request.params.groupId;
    logger.info(id, " id  of the group being fetched")
    const resolve = (group) => {
        response.status(200);
        response.json(group);
    };
    groupService.searchById(id)
        .then(resolve)
        .catch(renderErrorResponse);
}

/** 
* Update a Group object based on id 
*/
exports.update = (request,response) => {
    const id = request.params.groupId;
    const group = Object.assign({}, request.body);
    group._id = id;

    // creator cannot modify his id out of the group.
    const resolve = (group) => {
        response.status(201);
        if(group.name == "CustomUnauthorizedError") {
            response.status(401);
        }
        response.json(group);
    };
    groupService.update(group,request.payload.id)
        .then(resolve)
        .catch(renderErrorResponse);
}

/** 
 * Delete a group 
 */
exports.delete = (request,response) => {
    const id = request.params.groupId;
    const resolve = () => {
        response.status(204);
        response.json(" ");
    };
    groupService.delete(id)
        .then(resolve)
        .catch(renderErrorResponse);
}

/** 
 * Get all groups of the logged in user
 */
exports.list = (request,response) => {
    const id = request.payload.id;
    const resolve = (allGroups) => {
        response.status(200);
        response.json(allGroups);
    };
    logger.debug("in find all");
    groupService.findAll(id)
        .then(resolve)
        .catch(renderErrorResponse);
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
            if (error.name === "CustomUnauthorizedError") {
                status = 401;
            }
            response.status(status);
            response.json({
                message: error.message
            });
        }
    };
    return errorCallback;
};