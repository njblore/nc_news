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
  const { avatar_url, username } = req;

  return connection
    .select('*')
    .from('users')
    .where('username', '=', username)
    .update('avatar_url', avatar_url)
    .returning('*');
};

module.exports = { fetchUserById, addUser, fetchAllUsers, updateUserInfo };
