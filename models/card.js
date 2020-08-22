const mongoose = require('mongoose');
const validator = require('validator');

const cardsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(cardLink) {
        return validator.isURL(cardLink, { protocols: ['http', 'https'], require_protocol: true });
      },
      message: (props) => `Введенный вами URL-адрес: ${props.value} некорректен`,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('card', cardsSchema);
