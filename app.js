require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const routes = require('./routes/index');
const { requestLogger } = require('./middlewares/logger');
// const { errorLogger } = require('./middlewares/logger');
const { errorsHandler } = require('./middlewares/errorHandler');
const { limiter } = require('./middlewares/rateLimiter');
const { DATABASE } = require('./configs');

const { PORT = 3000, MONGO_URL = DATABASE } = process.env;
const app = express();

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(MONGO_URL);

app.use(requestLogger);

app.use(cors());

app.use(limiter);

app.use(routes);

// app.use(errorLogger);

app.use(errors());

app.use(errorsHandler);

app.listen(PORT, () => {
});
