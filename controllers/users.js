const { fetchUserById, addUser, fetchAllUsers } = require('../models/users');

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

const sendAllUsers = (req, res, next) => {
  fetchAllUsers().then(users => {
    res.status(200).send({ users });
  });
};

const postNewUser = (req, res, next) => {
  if (!req.body.name) {
    res.status(400).send({ msg: 'Missing Key "name".' });
  } else {
    fetchAllUsers()
      .then(users => {
        if (users.map(user => user.username).includes(req.body.username)) {
          res.status(422).send({ msg: 'User Already Exists' });
        } else {
          addUser(req.body)
            .then(([user]) => {
              res.status(201).send({ user });
            })
            .catch(next);
        }
      })
      .catch(next);
  }
};

module.exports = { sendUser, postNewUser, sendAllUsers };
