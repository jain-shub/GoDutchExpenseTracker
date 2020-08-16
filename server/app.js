'use strict';

module.exports = (app) => {
    const models = require('./models/index');
    const passport = require('./config/passport');
    const routes = require('./routes/index');
    routes(app);
}