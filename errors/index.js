exports.methodNotAllowed = (req, res) => {
  res.status(405).send({ msg: 'Method Not Allowed' });
};

exports.routeNotFound = (req, res, next) => {
  next({ status: 404, msg: 'Route Not Found' });
};

exports.handleCustomErrors = (err, req, res, next) => {
  console.log(err);
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else if (err.code === '22P02') {
    res.status(400).send({ msg: 'Bad Request' });
  } else {
    res.status(500).send({ msg: 'Internal Server Error' });
  }
};

// exports.handleSQLError = (err, req, res, next) => {
//   console.log(err);
//   if (err.code === '22P02') {
//     res.status(400).send({ msg: 'Bad Request' });
//   } else {
//     next(err);
//   }
// };

// exports.handle500 = (err, req, res, next) => {
//   res.status(500).send({ msg: 'Internal Server Error' });
// };
