const mongoose = require('mongoose');
const validator = require('validator');

const articlesSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(articleLink) {
        return validator.isURL(articleLink, { protocols: ['http', 'https'], require_protocol: true });
      },
      message: (props) => `URL-адрес статьи: ${props.value} некорректен`,
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(articleImageLink) {
        return validator.isURL(articleImageLink, { protocols: ['http', 'https'], require_protocol: true });
      },
      message: (props) => `URL-адрес иллюстрации статьи: ${props.value} некорректен`,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    select: false,
  },
});

articlesSchema.methods.hideOwner = function hideOwner() {
  const obj = this.toObject();
  delete obj.owner;
  return obj;
};

module.exports = mongoose.model('article', articlesSchema);
