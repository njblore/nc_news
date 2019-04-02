exports.routeNotFound = (req, res) => {
  res.status(404).send({ msg: 'Route Not Found' });
};

exports.methodNotAllowed = (req, res) => {
  res.status(405).send({ msg: 'Method Not Allowed' });
};

exports.handle500 = (err, req, res, next) => {
  if (err.code === 404) {
    res.status(404).send({ msg: 'Route Not Found' });
  } else if ((err.code === '42703') | (err.code === '22P02')) {
    res.status(400).send({ msg: 'Bad Request' });
  } else {
    res.status(500).send({ msg: 'Internal Server Error' });
  }
};
