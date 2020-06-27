const Article = require('../models/article');
const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');
const BadRequest = require('../errors/badRequest');
// исправить текст
const getArticles = ((req, res, next) => {
  const owner = req.user._id;
  Article.find({ owner })
    .then((article) => res.send({ data: article }))
    .catch((err) => next(err));
});

const createArticle = ((req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  Article.create({
    keyword, title, text, date, source, link, image, owner: req.user._id,
  })
    .then((newArticle) => res.status(201).send({ data: newArticle.hideOwner() }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(`Ошибка: ${err.message}`));
      } else {
        next(err);
      }
    });
});

const deleteArticle = ((req, res, next) => {
  Article.findById(req.params.articleId).select('+owner')
    .orFail(() => new NotFoundError('Ошибка, статьи с таким id нет'))
    .then((article) => {
      if (article.owner.toString() === req.user._id) {
        return article.remove()
          .then(() => res.send({ data: article }));
      }
      return Promise.reject(new ForbiddenError('Вы можете удалять только свои статьи'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest(`Введены некорректные данные ${err.message}`));
      } else {
        next(err);
      }
    });
});

module.exports = {
  getArticles,
  createArticle,
  deleteArticle,
};
