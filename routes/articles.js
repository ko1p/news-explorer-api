const articlesRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const urlValidation = require('../local_modules/urlValidation');
const BadRequest = require('../errors/badRequest');

const {
  getArticles, createArticle, deleteArticle,
} = require('../controllers/articles');

articlesRouter.get('/', auth, getArticles);
articlesRouter.post('/', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required()
      .error(() => new BadRequest('Не указано ключевое слово')),
    title: Joi.string().required()
      .error(() => new BadRequest('Не указан заголовок статьи')),
    text: Joi.string().required()
      .error(() => new BadRequest('Не указан текст статьи')),
    date: Joi.string().required()
      .error(() => new BadRequest('Не указана дата статьи')),
    source: Joi.string().required()
      .error(() => new BadRequest('Не указан источник статьи')),
    link: Joi.string().required().custom(urlValidation, 'custom URL validation')
      .error(() => new BadRequest('Не указан корректный URL-адрес статьи')),
    image: Joi.string().required().custom(urlValidation, 'custom URL validation')
      .error(() => new BadRequest('Не указан корректный URL-адрес изображения статьи')),
  }),
}),
auth, createArticle);

articlesRouter.delete('/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().alphanum().length(24).error(() => new BadRequest('Указан некорректный 24-значный id')),
  }),
}), auth, deleteArticle);

module.exports = articlesRouter;
