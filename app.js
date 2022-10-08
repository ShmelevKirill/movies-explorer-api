require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { errorsHandler } = require('./middlewares/errorsHandler');
const limiter = require('./utils/limiter');
const router = require('./routes');

const { PORT, MONGO_URL } = require('./utils/config');

const app = express();

app.use(requestLogger);

app.use(helmet());

app.use(limiter);

app.use(cors({
  origin: ['https://explorer.movies.nomoredomains.icu', 'http://explorer.movies.nomoredomains.icu'],
  methods: 'GET,POST,DELETE,OPTIONS,PATCH',
}));

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use(errorsHandler);

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('Connected to db');
  })
  .catch(() => {
    console.log('Error to db connection');
  });

app.listen(PORT, () => {
  console.log(`Server listen on ${PORT}`);
});
