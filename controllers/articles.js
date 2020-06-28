const Article = require('../models/article');
const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');
const BadRequest = require('../errors/badRequest');
const { thereIsNoArticle, notMyArticle, invalidId } = require('../errors/errorMessages');

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
    .catch((err) => next(err));
});

const deleteArticle = ((req, res, next) => {
  Article.findById(req.params.articleId).select('+owner')
    .orFail(() => new NotFoundError(thereIsNoArticle))
    .then((article) => {
      if (article.owner.toString() === req.user._id) {
        return article.remove()
          .then(() => res.send({ data: article }));
      }
      return Promise.reject(new ForbiddenError(notMyArticle));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest(invalidId));
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
