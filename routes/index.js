const Router = require('express-promise-router');
const handlers = require('../handlers');
const router = new Router();

router.get('/users', handlers.user.getUsers);
router.post('/signup', handlers.user.signup);
router.post('/signin', handlers.user.signin);

router.get('/events', handlers.event.getEvents);
router.post('/events', handlers.event.addEvent);
router.delete('/events/:eventId', handlers.event.removeEvent)


module.exports = (app) => {
    app.use(router);
};