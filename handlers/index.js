const userHandler = require('./user_handler');
const eventHandler = require('./event_handler');

module.exports = {
    user: userHandler,
    event: eventHandler
};