const MONGO_DEFAULT_URL = 'mongodb://localhost:27017/moviesdb';

module.exports.MONGO_URL = process.env.NODE_ENV === 'production' ? process.env.DB_CONN : MONGO_DEFAULT_URL;
