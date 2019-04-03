exports.methodNotAllowed = (req, res) => {
  res.status(405).send({ msg: 'Method Not Allowed' });
};

exports.routeNotFound = (req, res, next) => {
  next({ status: 404, msg: 'Route Not Found' });
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else if (err.code === '22P02' || err.code === '42703') {
    res.status(400).send({ msg: 'Bad Request' });
  } else if (err.code === '23503') {
    res.status(404).send({ msg: err.detail });
  } else {
    res.status(500).send({ msg: 'Internal Server Error' });
  }
};
