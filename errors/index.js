exports.methodNotAllowed = (req, res) => {
  res.status(405).send({ msg: 'Method Not Allowed' });
};

exports.routeNotFound = (req, res, next) => {
  next({ status: 404, msg: 'Route Not Found' });
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handleSQLErrors = (err, req, res, next) => {
  if (err.code === '22P02' || err.code === '42703') {
    res.status(400).send({ msg: 'Bad Request' });
  } else if (err.code === '23503') {
    res.status(404).send({ msg: err.detail });
  } else if (err.code === '23502') {
    res.status(400).send({ msg: `Missing Value for Key '${err.column}'` });
  } else {
    next(err);
  }
};

exports.handle500 = (err, req, res, next) => {
  res.status(500).send({ msg: 'Internal Server Error' });
};
