const jwt = require('express-jwt');

/**
 * Auth Module responsible for the Auth token in the HTTP requests coming in
 * 
 * @author rohan_bharti
 */

/**
 * Checks if the request coming in has a token or not
 * 
 * @param {*} req 
 */
const getTokenFromHeaders = (req) => {
    const { headers: { authorization } } = req;

    if (authorization && authorization.split(' ')[0] === 'Token') {
        return authorization.split(' ')[1];
    }
    return null;
};

/**
 * Auth object takes care in our routes to check which APIs require for the user to be logged in and
 * which ones the user can access without being logged in
 */
const auth = {
    required: jwt({
        secret: 'secret',
        requestProperty: 'payload',
        getToken: getTokenFromHeaders,
    }),
    optional: jwt({
        secret: 'secret',
        requestProperty: 'payload',
        getToken: getTokenFromHeaders,
        credentialsRequired: false,
    }),
};

module.exports = auth;