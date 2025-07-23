const {Router} = require('express');
const userController = require('./controllers/userController');
const {body} = require('express-validator');
const authRouter = Router();

authRouter.post('/registration', 
    body('email').isEmail(),
    body('password').isLength({min: 8, max: 64}),
    userController.regist
);
authRouter.post('/login', userController.login);
authRouter.post('/logout', userController.logout);
authRouter.get('/refresh', userController.refresh);

module.exports = authRouter;