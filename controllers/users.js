const { fetchUserById } = require('../models/users');

const sendUser = (req, res, next) => {
  fetchUserById(req.params)
    .then(([user]) => {
      if (user === undefined) {
        next({ code: 404 });
      } else {
        res.status(200).send({ user });
      }
    })
    .catch(next);
};

module.exports = { sendUser };
