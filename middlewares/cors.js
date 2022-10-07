const allowedCors = [
  'https://explorer.movies.nomoredomains.sbs',
  'http://explorer.movies.nomoredomains.sbs',
  'http://localhost:3000',
  'https://localhost:3000',
  'https://explorer.movies.nomoredomains.icu',
  'http://explorer.movies.nomoredomains.icu',
];

const cors = (req, res, next) => {
  const { origin } = req.headers;
  const requestHeaders = req.headers['access-control-request-headers'];
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }

  return next();
};

module.exports = cors;
