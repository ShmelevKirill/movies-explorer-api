require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const { PORT = 3000 } = process.env;
const { errorProcessor } = require('./middlewares/error-processor');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routes = require('./routes/index');
const { MONGO_URL } = require('./config');

const options = {
  origin: [
    'http://localhost:3000',
    'https://localhost:3000',
    'http://localhost:3001',
    'https://localhost:3001',
    'https://explorer.movies.nomoredomains.sbs',
    'http://explorer.movies.nomoredomains.sbs',
    'https://explorer.movies.nomoredomains.icu',
    'http://explorer.movies.nomoredomains.icu',
  ],
  credentials: true,
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

mongoose.connect(MONGO_URL);

const app = express();

app.use(limiter);
app.use('*', cors(options));
app.use(helmet());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.use(routes);
app.use(errorLogger);

app.use(errors());
app.use(errorProcessor);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
