const jwt = require('jsonwebtoken');
const UnAuthorized = require('../errors/unauthorized');
const { notAuthorized, wrongToken } = require('../errors/errorMessages');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnAuthorized(notAuthorized));
  }
  const token = authorization.replace('Bearer ', '');
  let playload;

  try {
    playload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'secKeyForDevelopment');
  } catch (err) {
    return next(new UnAuthorized(wrongToken));
  }
  req.user = playload;
  return next();
};
