const articlesRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const urlValidation = require('../local_modules/urlValidation');
const BadRequest = require('../errors/badRequest');
const {
  noKeyword, noTitleArticle, noTextArticle, noDateArticle,
  noSourceArticle, wrongArticleURL, wrongImageURL, invalidId,
} = require('../errors/errorMessages');

const {
  getArticles, createArticle, deleteArticle,
} = require('../controllers/articles');

articlesRouter.get('/', auth, getArticles);
articlesRouter.post('/', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required()
      .error(() => new BadRequest(noKeyword)),
    title: Joi.string().required()
      .error(() => new BadRequest(noTitleArticle)),
    text: Joi.string().required()
      .error(() => new BadRequest(noTextArticle)),
    date: Joi.string().required()
      .error(() => new BadRequest(noDateArticle)),
    source: Joi.string().required()
      .error(() => new BadRequest(noSourceArticle)),
    link: Joi.string().required().custom(urlValidation, 'custom URL validation')
      .error(() => new BadRequest(wrongArticleURL)),
    image: Joi.string().required().custom(urlValidation, 'custom URL validation')
      .error(() => new BadRequest(wrongImageURL)),
  }),
}),
auth, createArticle);

articlesRouter.delete('/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().alphanum().length(24).error(() => new BadRequest(invalidId)),
  }),
}), auth, deleteArticle);

module.exports = articlesRouter;
