const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { createUser, login } = require('../controllers/users');
const NotFoundError = require('../errors/notFoundError');
const BadRequest = require('../errors/badRequest');

router.use('/articles', require('./articles'));
router.use('/users', require('./users'));

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().error(() => new BadRequest('Необходимо указать верный email адрес')),
    password: Joi.string().required().error(() => new BadRequest('Необходимо указать пароль')),
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .error(() => new BadRequest('Имя обязательное поле от 2 до 30 символов')),
    email: Joi.string().required().email()
      .error(() => new BadRequest('Необходимо указать верный email адрес')),
    password: Joi.string().required()
      .error(() => new BadRequest('Необходимо указать пароль')),
  }),
}), createUser);
router.use('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

module.exports = router;
