const connection = require('../db/connection');

const fetchUserById = params => {
  const { username } = params;
  return connection
    .select('*')
    .from('users')
    .where('username', '=', username);
};

const fetchAllUsers = () => {
  return connection.select('*').from('users');
};

const addUser = req => {
  return connection
    .insert(req)
    .into('users')
    .returning('*');
};

const updateUserInfo = req => {
  const { avatar_url, username, name } = req;

  return connection
    .select('*')
    .from('users')
    .where('username', '=', username)
    .modify(userQuery => {
      if (avatar_url) {
        userQuery.update('avatar_url', avatar_url);
      }
      if (name) {
        userQuery.update('name', name);
      }
    })
    .returning('*');
};

module.exports = { fetchUserById, addUser, fetchAllUsers, updateUserInfo };
