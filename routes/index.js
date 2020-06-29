const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { createUser, login } = require('../controllers/users');
const NotFoundError = require('../errors/notFoundError');
const BadRequest = require('../errors/badRequest');
const {
  notFoundURL, noEmail, noPassword, noName,
} = require('../errors/errorMessages');

router.use('/articles', require('./articles'));
router.use('/users', require('./users'));

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().error(() => new BadRequest(noEmail)),
    password: Joi.string().required().error(() => new BadRequest(noPassword)),
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .error(() => new BadRequest(noName)),
    email: Joi.string().required().email()
      .error(() => new BadRequest(noEmail)),
    password: Joi.string().required()
      .error(() => new BadRequest(noPassword)),
  }),
}), createUser);
router.use('*', () => {
  throw new NotFoundError(notFoundURL);
});

module.exports = router;
