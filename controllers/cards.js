const Card = require('../models/card');
const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');
const BadRequest = require('../errors/badRequest');

const getAllCards = ((req, res, next) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch((err) => next(err));
});

const createCard = ((req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((newCard) => res.send({ data: newCard }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(`Ошибка: ${err.message}`));
      } else {
        next(err);
      }
    });
});

const deleteCard = ((req, res, next) => {
  Card.findById(req.params.id)
    .orFail(() => new NotFoundError('Ошибка, карточки с таким id нет'))
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        return card.remove()
          .then(() => res.send({ data: card }));
      }
      return Promise.reject(new ForbiddenError('Вы можете удалять только свои карточки'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest(`Введены некорректные данные ${err.message}`));
      } else {
        next(err);
      }
    });
});

const likeCard = ((req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new NotFoundError('Ошибка, не удалось поставить лайк, карточки с таким id нет'))
    .then(() => res.send({ message: 'Карточка лайкнута' }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest(`Введены некорректные данные ${err.message}`));
      } else {
        next(err);
      }
    });
});

const dislikeCard = ((req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new NotFoundError('Ошибка, не удалось снять лайк, карточки с таким id нет'))
    .then(() => res.send({ message: 'Лайк с карточки успешно убран' }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest(`Введены некорректные данные ${err.message}`));
      } else {
        next(err);
      }
    });
});

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
