require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/notFoundError');
const BadRequest = require('../errors/badRequest');
const Unauthorized = require('../errors/unauthorized');
const Conflict = require('../errors/conflict');

const login = ((req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'secKeyForDevelopment',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      });
      res.send({ token });
    })
    .catch((err) => {
      next(new Unauthorized(`${err.message}`));
    });
});

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => new NotFoundError('Вы ещё не зарегистрировались или ваша учетная запись была удалена.'))
    .then((user) => res.send({ data: user }))
    .catch((err) => next(err));
};

const createUser = ((req, res, next) => {
  const {
    name, email, password, about, avatar,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, email, password: hash, about, avatar,
      })
        .then((user) => res.status(201).send({ data: user.hideHash() }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new BadRequest(`Ошибка: ${err.message}`));
          } else if (err.code === 11000) {
            next(new Conflict(`Указанный вами email: ${req.body.email} уже используется`));
          } else {
            next(err);
          }
        });
    });
});

module.exports = {
  login,
  getUserInfo,
  createUser,
};
