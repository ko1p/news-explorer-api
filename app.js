require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');

const {
  PORT, DATABASE_URL, DATABASE_OPTIONS, RATE_LIMIT_CONFIG,
} = require('./config');

const app = express();
// const corsOptions = {
//   origin: [
//       'http://localhost:8080',
//       'http://newsapp.ga/'
//   ],
//   credentials: true,
// };
app.use(cors());
app.use(rateLimit(RATE_LIMIT_CONFIG));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect(DATABASE_URL, DATABASE_OPTIONS);

app.use(requestLogger);

app.use('/', require('./routes/index'));

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Сервер запущен на ${PORT} порту`);
});
