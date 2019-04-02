const { fetchUserById } = require('../models/users');

const sendUser = (req, res, next) => {
  fetchUserById(req.params).then(([user]) => {
    //user = user[0];
    res.status(200).send({ user });
  });
};

module.exports = { sendUser };
