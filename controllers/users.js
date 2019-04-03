const { fetchUserById } = require('../models/users');

const sendUser = (req, res, next) => {
  fetchUserById(req.params)
    .then(([user]) => {
      if (!user) {
        next({ status: 404, msg: 'User Not Found' });
      } else {
        res.status(200).send({ user });
      }
    })
    .catch(next);
};

module.exports = { sendUser };
