const cardsRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const urlValidation = require('../local_modules/urlValidation');
const idValidationProps = require('../local_modules/idValidationProps');

const {
  getAllCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

cardsRouter.get('/', auth, getAllCards);
cardsRouter.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(urlValidation, 'custom URL validation'),
  }),
}),
auth, createCard);
cardsRouter.delete('/:id', celebrate(idValidationProps),
  auth, deleteCard);
cardsRouter.put('/:id/likes', celebrate(idValidationProps),
  auth, likeCard);
cardsRouter.delete('/:id/likes', celebrate(idValidationProps),
  auth, dislikeCard);

module.exports = cardsRouter;
