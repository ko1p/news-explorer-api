module.exports.PORT = process.env.PORT || 3000;
module.exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/news-explorer-api';
module.exports.DATABASE_OPTIONS = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};
module.exports.RATE_LIMIT_CONFIG = {
  windowMs: 15 * 60 * 1000,
  max: 100,
};
