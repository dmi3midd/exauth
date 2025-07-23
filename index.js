const authRouter = require('./src/router');
const errorMiddleware = require('./src/middlewares/errorMiddleware');

module.exports = {
    authRouter,
    errorMiddleware
}